from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    session,
)
from flask_login import login_required, login_user, logout_user, current_user

from . import db
from .models import Product, Category, User, Order, OrderItem
from .forms import RegisterForm, LoginForm, ProductForm, CheckoutForm


main_bp = Blueprint("main", __name__)
shop_bp = Blueprint("shop", __name__)
cart_bp = Blueprint("cart", __name__)


def _get_cart():
    return session.setdefault("cart", {})


def _save_cart(cart):
    session["cart"] = cart
    session.modified = True


@main_bp.route("/")
def home():
    featured = Product.query.filter_by(is_featured=True).limit(8).all()
    best_sellers = Product.query.filter_by(is_best_seller=True).limit(8).all()
    categories = Category.query.all()
    return render_template(
        "home.html",
        featured=featured,
        best_sellers=best_sellers,
        categories=categories,
    )


@main_bp.route("/studio")
def studio():
    return render_template("studio.html")


@main_bp.route("/blogs")
def blogs():
    return render_template("blogs.html")


@main_bp.route("/about")
def about():
    return render_template("about.html")


@shop_bp.route("/")
def shop_index():
    page = request.args.get("page", 1, type=int)
    category_slug = request.args.get("category")
    search = request.args.get("q", "")
    sort = request.args.get("sort", "featured")

    query = Product.query
    if category_slug:
        category = Category.query.filter_by(slug=category_slug).first_or_404()
        query = query.filter_by(category=category)
    if search:
        like = f"%{search}%"
        query = query.filter(Product.name.ilike(like))

    if sort == "price_asc":
        query = query.order_by(Product.price.asc(), Product.id.desc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc(), Product.id.desc())
    elif sort == "name_asc":
        query = query.order_by(Product.name.asc(), Product.id.desc())
    elif sort == "newest":
        query = query.order_by(Product.id.desc())
    else:  # featured (default)
        query = query.order_by(Product.is_featured.desc(), Product.is_best_seller.desc(), Product.id.desc())

    pagination = query.paginate(page=page, per_page=12, error_out=False)

    categories = Category.query.all()
    return render_template(
        "shop.html",
        products=pagination.items,
        pagination=pagination,
        categories=categories,
        current_category=category_slug,
        search=search,
        current_sort=sort,
    )


@shop_bp.route("/<int:product_id>")
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    return render_template("product.html", product=product)


@cart_bp.route("/")
def view_cart():
    cart = _get_cart()
    product_ids = [int(pid) for pid in cart.keys()]
    products = Product.query.filter(Product.id.in_(product_ids)).all() if product_ids else []
    items = []
    total = 0
    for product in products:
        quantity = cart.get(str(product.id), 0)
        subtotal = product.price * quantity
        total += subtotal
        items.append({"product": product, "quantity": quantity, "subtotal": subtotal})
    return render_template("cart.html", items=items, total=total)


@cart_bp.route("/add/<int:product_id>", methods=["POST"])
def add_to_cart(product_id):
    product = Product.query.get_or_404(product_id)
    quantity = request.form.get("quantity", 1, type=int)
    cart = _get_cart()
    cart[str(product.id)] = cart.get(str(product.id), 0) + max(quantity, 1)
    _save_cart(cart)
    
    if request.headers.get("Accept") == "application/json":
        return {
            "success": True, 
            "message": f"Added {product.name} to cart.",
            "cart_count": sum(cart.values())
        }
        
    flash(f"Added {product.name} to cart.", "success")
    return redirect(request.referrer or url_for("shop.shop_index"))


@cart_bp.route("/update/<int:product_id>", methods=["POST"])
def update_cart_item(product_id):
    cart = _get_cart()
    quantity = request.form.get("quantity", 1, type=int)
    if quantity <= 0:
        cart.pop(str(product_id), None)
    else:
        cart[str(product_id)] = quantity
    _save_cart(cart)
    flash("Cart updated.", "info")
    return redirect(url_for("cart.view_cart"))


@cart_bp.route("/remove/<int:product_id>", methods=["POST"])
def remove_from_cart(product_id):
    cart = _get_cart()
    cart.pop(str(product_id), None)
    _save_cart(cart)
    flash("Item removed from cart.", "info")
    return redirect(url_for("cart.view_cart"))


@cart_bp.route("/clear", methods=["POST"])
def clear_cart():
    _save_cart({})
    flash("Cart has been cleared.", "info")
    return redirect(url_for("cart.view_cart"))


@cart_bp.route("/checkout", methods=["GET", "POST"])
@login_required
def checkout():
    cart = _get_cart()
    if not cart:
        flash("Your cart is empty.", "warning")
        return redirect(url_for("shop.shop_index"))

    form = CheckoutForm()
    if form.validate_on_submit():
        product_ids = [int(pid) for pid in cart.keys()]
        products = (
            Product.query.filter(Product.id.in_(product_ids)).all() if product_ids else []
        )
        total = 0
        order = Order(
            user=current_user,
            address_line1=form.address_line1.data,
            address_line2=form.address_line2.data,
            city=form.city.data,
            state=form.state.data,
            postal_code=form.postal_code.data,
            country=form.country.data or "India",
            payment_method=form.payment_method.data,
            total_amount=0,
        )
        db.session.add(order)

        for product in products:
            quantity = cart.get(str(product.id), 0)
            if quantity <= 0:
                continue
            subtotal = product.price * quantity
            total += subtotal
            item = OrderItem(
                order=order,
                product_id=product.id,
                quantity=quantity,
                unit_price=product.price,
            )
            db.session.add(item)

        order.total_amount = total
        db.session.commit()
        session.pop("cart", None)
        flash("Order placed successfully!", "success")
        return redirect(url_for("main.home"))

    return render_template("checkout.html", form=form)


# Authentication blueprint
auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("main.home"))
    form = RegisterForm()
    if form.validate_on_submit():
        if User.query.filter_by(email=form.email.data).first():
            flash("Email already registered. Please log in.", "warning")
            return redirect(url_for("auth.login"))
        user = User(name=form.name.data, email=form.email.data.lower())
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash("Account created. You can now log in.", "success")
        return redirect(url_for("auth.login"))
    return render_template("register.html", form=form)


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.home"))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data.lower()).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            flash("Logged in successfully.", "success")
            next_page = request.args.get("next")
            return redirect(next_page or url_for("main.home"))
        flash("Invalid credentials.", "danger")
    return render_template("login.html", form=form)


@auth_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "info")
    return redirect(url_for("main.home"))


# Admin blueprint
admin_bp = Blueprint("admin", __name__)


def admin_required(func):
    from functools import wraps

    @wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            flash("Admin access required.", "danger")
            return redirect(url_for("auth.login"))
        return func(*args, **kwargs)

    return wrapper


@admin_bp.route("/")
@login_required
@admin_required
def dashboard():
    products = Product.query.order_by(Product.id.desc()).all()
    orders = Order.query.order_by(Order.created_at.desc()).limit(10).all()
    return render_template("admin.html", products=products, orders=orders)


@admin_bp.route("/product/new", methods=["GET", "POST"])
@login_required
@admin_required
def create_product():
    form = ProductForm()
    form.category.choices = [
        (c.id, c.name) for c in Category.query.order_by(Category.name).all()
    ]
    if form.validate_on_submit():
        product = Product(
            name=form.name.data,
            price=form.price.data,
            description=form.description.data,
            care_instructions=form.care_instructions.data,
            category_id=form.category.data or None,
            is_featured=form.is_featured.data,
            is_best_seller=form.is_best_seller.data,
        )
        db.session.add(product)
        db.session.commit()
        flash("Product created.", "success")
        return redirect(url_for("admin.dashboard"))
    return render_template("admin_product_form.html", form=form, title="Add Product")


@admin_bp.route("/product/<int:product_id>/edit", methods=["GET", "POST"])
@login_required
@admin_required
def edit_product(product_id):
    product = Product.query.get_or_404(product_id)
    form = ProductForm(obj=product)
    form.category.choices = [
        (c.id, c.name) for c in Category.query.order_by(Category.name).all()
    ]
    if form.validate_on_submit():
        form.populate_obj(product)
        db.session.commit()
        flash("Product updated.", "success")
        return redirect(url_for("admin.dashboard"))
    return render_template("admin_product_form.html", form=form, title="Edit Product")


@admin_bp.route("/product/<int:product_id>/delete", methods=["POST"])
@login_required
@admin_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    flash("Product deleted.", "info")
    return redirect(url_for("admin.dashboard"))


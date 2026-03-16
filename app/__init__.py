from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from pathlib import Path
import os

# Compatibility shim for Flask-Login with Werkzeug 3+
try:
    from werkzeug import urls as _wz_urls

    if not hasattr(_wz_urls, "url_decode"):  # pragma: no cover - defensive
        from urllib.parse import parse_qsl

        def _url_decode(query, charset="utf-8", errors="replace", include_empty=True):
            pairs = parse_qsl(query, keep_blank_values=include_empty, encoding=charset, errors=errors)
            return {k: v for k, v in pairs}

        _wz_urls.url_decode = _url_decode  # type: ignore[attr-defined]
except Exception:
    pass

from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()
csrf = None
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)

    # Basic config
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key-change-me")
    base_dir = Path(__file__).resolve().parent.parent
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        db_path = base_dir / "potandplants.db"
        db_url = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Extensions
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    # CSRFProtect is optional and causes issues with older Flask-WTF/Flask
    # If you want CSRF, install compatible versions and enable here:
    # csrf.init_app(app)
    bcrypt.init_app(app)

    # Ensure tables exist (simple auto-create for dev) and seed demo data
    from . import models  # noqa: F401
    from .models import Category, Product
    with app.app_context():
        db.create_all()

        # Seed basic categories if none exist
        if not Category.query.first():
            demo_categories = [
                Category(name="Indoor Plants", slug="indoor-plants"),
                Category(name="Outdoor Plants", slug="outdoor-plants"),
                Category(name="Pots", slug="pots"),
                Category(name="Gardening Tools", slug="gardening-tools"),
            ]
            db.session.add_all(demo_categories)
            db.session.commit()

        # Seed Indian nursery-style demo products if shop has fewer than 20 items
        if Product.query.count() < 20:
            indoor = Category.query.filter_by(slug="indoor-plants").first()
            outdoor = Category.query.filter_by(slug="outdoor-plants").first()
            pots = Category.query.filter_by(slug="pots").first()

            demo_products = [
                dict(
                    name="Fiddle Leaf Fig",
                    price=1299.0,
                    description="A statement indoor plant with large violin-shaped leaves. Loves bright, indirect light.",
                    care_instructions="Bright, filtered light • Water when top soil is dry • Wipe leaves monthly.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=True,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Snake Plant",
                    price=699.0,
                    description="Low-maintenance plant that thrives on neglect and purifies indoor air.",
                    care_instructions="Low to bright light • Water every 2–3 weeks • Avoid overwatering.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=True,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Terracotta Pot Set (3)",
                    price=549.0,
                    description="Set of three earthy terracotta pots, perfect for succulents and herbs.",
                    care_instructions="Use with well-draining soil • Suitable for indoor and outdoor use.",
                    image_filename=None,
                    is_featured=False,
                    is_best_seller=True,
                    category_id=pots.id if pots else None,
                ),
                dict(
                    name="Areca Palm",
                    price=999.0,
                    description="Lush outdoor-friendly palm that instantly adds tropical vibes to balconies.",
                    care_instructions="Bright light • Keep soil lightly moist • Mist occasionally.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=False,
                    category_id=outdoor.id if outdoor else None,
                ),
                dict(
                    name="Money Plant (Pothos) in Ceramic Pot",
                    price=499.0,
                    description="Lucky Indian money plant in a glossy ceramic pot, perfect for desks and side tables.",
                    care_instructions="Low to medium light • Water when top inch of soil is dry.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=True,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Tulsi (Holy Basil)",
                    price=299.0,
                    description="Sacred Tulsi plant, a staple in Indian homes and balconies.",
                    care_instructions="Full sun • Water daily in summers • Trim regularly.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=True,
                    category_id=outdoor.id if outdoor else None,
                ),
                dict(
                    name="Jasmine (Mogra) Plant",
                    price=399.0,
                    description="Fragrant jasmine climber that fills evenings with a sweet aroma.",
                    care_instructions="Full to partial sun • Keep soil moist • Provide support to climb.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=False,
                    category_id=outdoor.id if outdoor else None,
                ),
                dict(
                    name="Hibiscus (Gudhal) Red",
                    price=349.0,
                    description="Classic red hibiscus, ideal for pooja flowers and tea infusions.",
                    care_instructions="6+ hours of sun • Water regularly • Feed monthly.",
                    image_filename=None,
                    is_featured=False,
                    is_best_seller=True,
                    category_id=outdoor.id if outdoor else None,
                ),
                dict(
                    name="Marigold (Genda) Combo",
                    price=259.0,
                    description="Set of orange and yellow marigolds for festive decor and borders.",
                    care_instructions="Full sun • Water daily • Deadhead spent flowers.",
                    image_filename=None,
                    is_featured=False,
                    is_best_seller=True,
                    category_id=outdoor.id if outdoor else None,
                ),
                dict(
                    name="Neem Sapling",
                    price=249.0,
                    description="Traditional Indian neem tree sapling, known for its medicinal value.",
                    care_instructions="Plant in ground • Full sun • Water regularly in first year.",
                    image_filename=None,
                    is_featured=False,
                    is_best_seller=False,
                    category_id=outdoor.id if outdoor else None,
                ),
                dict(
                    name="Spider Plant",
                    price=349.0,
                    description="Air-purifying hanging plant loved in Indian apartments and offices.",
                    care_instructions="Bright, indirect light • Keep soil slightly moist.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=True,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Peace Lily",
                    price=599.0,
                    description="Elegant flowering indoor plant that thrives in low light corners.",
                    care_instructions="Low to medium light • Keep soil evenly moist • Mist leaves.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=True,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Areca Palm (Indoor)",
                    price=1099.0,
                    description="Indoor-rated areca palm for living rooms, hallways and office lobbies.",
                    care_instructions="Bright, indirect light • Water when top soil dries.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=False,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Rubber Plant (Ficus elastica)",
                    price=899.0,
                    description="Glossy-leaved rubber plant that suits modern Indian interiors.",
                    care_instructions="Bright, filtered light • Water moderately • Wipe leaves.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=False,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Aloe Vera",
                    price=249.0,
                    description="Healing succulent widely grown in Indian homes for skin and hair care.",
                    care_instructions="Full sun to bright light • Water sparingly • Use sandy soil.",
                    image_filename=None,
                    is_featured=False,
                    is_best_seller=True,
                    category_id=outdoor.id if outdoor else None,
                ),
                dict(
                    name="Bougainvillea (Desi Mix)",
                    price=699.0,
                    description="Colourful bougainvillea climber mix, great for terraces and compound walls.",
                    care_instructions="Full sun • Very drought tolerant • Minimal watering.",
                    image_filename=None,
                    is_featured=False,
                    is_best_seller=False,
                    category_id=outdoor.id if outdoor else None,
                ),
                dict(
                    name="Curry Leaf (Kadi Patta)",
                    price=329.0,
                    description="Essential curry leaf plant for authentic Indian tadkas.",
                    care_instructions="Full to partial sun • Water regularly • Pinch tips to encourage bushiness.",
                    image_filename=None,
                    is_featured=False,
                    is_best_seller=True,
                    category_id=outdoor.id if outdoor else None,
                ),
                dict(
                    name="Indoor Herb Trio (Tulsi, Mint, Coriander)",
                    price=599.0,
                    description="Kitchen-friendly set of Tulsi, pudina and dhania in compact planters.",
                    care_instructions="Sunny windowsill • Keep soil moist • Harvest regularly.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=True,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Lucky Bamboo (3 Layer) in Glass",
                    price=499.0,
                    description="Vaastu-friendly lucky bamboo arrangement often gifted in Indian homes and offices.",
                    care_instructions="Bright, indirect light • Change water weekly • Keep roots submerged.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=True,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Succulent Combo (Indian Favourites)",
                    price=699.0,
                    description="Set of 4 mixed succulents ideal for Indian balconies and work desks.",
                    care_instructions="Bright light • Water only when soil is fully dry.",
                    image_filename=None,
                    is_featured=False,
                    is_best_seller=True,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Indoor Areca + Ceramic Pot",
                    price=1399.0,
                    description="Gift-ready areca palm in a premium white ceramic pot.",
                    care_instructions="Bright, indirect light • Water when top inch is dry.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=True,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Snake Plant (Sansevieria) Starter",
                    price=399.0,
                    description="Compact snake plant ideal for bedrooms and study tables.",
                    care_instructions="Low to bright light • Water every 2–3 weeks.",
                    image_filename=None,
                    is_featured=False,
                    is_best_seller=True,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="ZZ Plant",
                    price=899.0,
                    description="Hardy, almost unkillable ZZ plant, perfect for busy urban lifestyles.",
                    care_instructions="Low to medium light • Water when soil fully dries.",
                    image_filename=None,
                    is_featured=True,
                    is_best_seller=False,
                    category_id=indoor.id if indoor else None,
                ),
                dict(
                    name="Indoor Fern Basket",
                    price=649.0,
                    description="Lush fern in a hanging basket, great for balconies and shaded verandas.",
                    care_instructions="Partial shade • Keep soil moist • Mist frequently in summers.",
                    image_filename=None,
                    is_featured=False,
                    is_best_seller=False,
                    category_id=indoor.id if indoor else None,
                ),
            ]
            for data in demo_products:
                if not Product.query.filter_by(name=data["name"]).first():
                    db.session.add(Product(**data))
            db.session.commit()

    login_manager.login_view = "auth.login"
    login_manager.login_message_category = "info"

    # Blueprints (all defined in routes.py)
    from .routes import main_bp, shop_bp, cart_bp, auth_bp, admin_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(shop_bp, url_prefix="/shop")
    app.register_blueprint(cart_bp, url_prefix="/cart")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    return app


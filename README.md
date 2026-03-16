# Pot & Plants 🌿

Pot & Plants is a modern, responsive plant nursery e‑commerce website built with Flask, SQLAlchemy, and a green, nature‑inspired UI.

## Features

- Responsive design (mobile + desktop)
- Product listing with categories, search, and pagination
- Product detail pages with care instructions
- Session-based shopping cart (add, update quantity, remove)
- Checkout flow with address and payment method (UPI, card, COD)
- User registration, login, logout
- Admin dashboard (protected) to add/edit/delete products and view recent orders
- Flash messages and smooth UI polish

## Tech stack

- **Backend**: Python 3, Flask, SQLAlchemy, Flask-Login, Flask-WTF
- **Database**: SQLite by default (can use PostgreSQL via `DATABASE_URL`)
- **Frontend**: HTML, CSS, JavaScript, Jinja2 templates

## Project structure

```text
app.py                # Entry point
app/
  __init__.py         # App factory & extensions
  models.py           # SQLAlchemy models
  forms.py            # WTForms/Flask-WTF forms
  routes.py           # Main, shop, cart, auth, and admin blueprints
  templates/          # Jinja2 templates
  static/
    css/styles.css    # Main styles (responsive, modern UI)
    js/main.js        # Small UX enhancements
```

## Setup & running locally

1. **Create a virtual environment (recommended)**

```bash
cd potandplants
python -m venv venv
venv\Scripts\activate  # on Windows
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Set environment variables (optional)**

By default the app uses SQLite at `potandplants.db` and a dev secret key. To override:

```bash
set SECRET_KEY=your-secret-key
set DATABASE_URL=postgresql+psycopg2://user:pass@host:port/dbname
```

4. **Initialize the database**

From the project root:

```bash
python
>>> from app import create_app, db
>>> from app.models import Category, User
>>> app = create_app()
>>> app.app_context().push()
>>> db.create_all()

# (optional) create default categories
>>> Category(name="Indoor Plants", slug="indoor-plants")
>>> Category(name="Outdoor Plants", slug="outdoor-plants")
>>> Category(name="Pots", slug="pots")
>>> Category(name="Gardening Tools", slug="gardening-tools")
>>> db.session.add_all([...])
>>> db.session.commit()

# (optional) create admin user
>>> admin = User(name="Admin", email="admin@example.com", is_admin=True)
>>> admin.set_password("changeme")
>>> db.session.add(admin)
>>> db.session.commit()
```

5. **Run the development server**

```bash
python app.py
```

Then visit `http://127.0.0.1:5000` in your browser.

## Notes

- To switch to PostgreSQL in production, point `DATABASE_URL` to your Postgres instance.
- Image uploads are represented by `image_filename` fields; you can place image files in `app/static/images/` and set the file names via the admin forms.


from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    PasswordField,
    SubmitField,
    BooleanField,
    TextAreaField,
    FloatField,
    IntegerField,
    SelectField,
)
from wtforms.validators import DataRequired, Email, EqualTo, Length, NumberRange


class RegisterForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(), Length(max=120)])
    email = StringField("Email", validators=[DataRequired(), Email(), Length(max=120)])
    password = PasswordField("Password", validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField(
        "Confirm Password", validators=[DataRequired(), EqualTo("password")]
    )
    submit = SubmitField("Create Account")


class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    remember = BooleanField("Remember me")
    submit = SubmitField("Login")


class ProductForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(), Length(max=200)])
    price = FloatField("Price", validators=[DataRequired(), NumberRange(min=0)])
    description = TextAreaField("Description", validators=[DataRequired()])
    care_instructions = TextAreaField("Care Instructions")
    category = SelectField("Category", coerce=int)
    is_featured = BooleanField("Featured")
    is_best_seller = BooleanField("Best Seller")
    submit = SubmitField("Save Product")


class CheckoutForm(FlaskForm):
    address_line1 = StringField("Address line 1", validators=[DataRequired()])
    address_line2 = StringField("Address line 2")
    city = StringField("City", validators=[DataRequired()])
    state = StringField("State", validators=[DataRequired()])
    postal_code = StringField("Postal Code", validators=[DataRequired()])
    country = StringField("Country", default="India")
    payment_method = SelectField(
        "Payment Method",
        choices=[
            ("upi", "UPI"),
            ("card", "Card"),
            ("cod", "Cash on Delivery"),
        ],
        validators=[DataRequired()],
    )
    submit = SubmitField("Place Order")


from app import create_app


app = create_app()


if __name__ == "__main__":
    # You can change host/port here if needed
    app.run(debug=True)


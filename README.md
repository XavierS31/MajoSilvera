<div align="center">
  <img src="assets/brandWhiteGold.png" alt="MajoSilveraLogo" width="500">
  <h1>MajoSilvera</h1>
  <p>Official MajoSilvera - Fisio Esthetic.</p>
  <p>Visit MajoSilvera at ...</p>
</div>

## Backend services

The API uses PostgreSQL and OAuth2 token introspection. Apply [the schema migration](backend/db/001_initial_schema.sql) to the target database before deployment, then configure the values in `backend/.env` (the file is git-ignored).

Run the Gemini service separately from `backend/chatbot` with `pip install -r requirements.txt` and `uvicorn main:app --host 0.0.0.0 --port 8000`. Set `CHATBOT_URL` to its private URL. The OAuth2 provider must return an active token with an `admin` role, role list, or scope for admin routes.

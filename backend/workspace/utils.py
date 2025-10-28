import secrets

def generate_invite_token(length: int = 32) -> str:
    return secrets.token_urlsafe(length)

import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch, AsyncMock
import jwt
from auth import (
    verify_password,
    get_user,
    authenticate_user,
    create_access_token,
    require_role,
    User,
    SECRET_KEY,
    ALGORITHM,
    pwd_context,
    fake_users_db,
)


class TestPasswordVerification(unittest.TestCase):
    """Tests for password verification"""

    def setUp(self):
        self.plain_password = "testpassword123"
        self.hashed_password = pwd_context.hash(self.plain_password)
        self.wrong_password = "wrongpassword"

    def test_verify_correct_password(self):
        """Verify correct password"""
        result = verify_password(self.plain_password, self.hashed_password)
        self.assertTrue(result)

    def test_verify_incorrect_password(self):
        """Verify incorrect password"""
        result = verify_password(self.wrong_password, self.hashed_password)
        self.assertFalse(result)

    def test_verify_empty_password(self):
        """Verify empty password"""
        result = verify_password("", self.hashed_password)
        self.assertFalse(result)


class TestUserOperations(unittest.TestCase):
    """Tests for user operations"""

    def test_get_existing_user(self):
        """Retrieve an existing user"""
        user = get_user("admin")
        self.assertIsNotNone(user)
        self.assertEqual(user.username, "admin")
        self.assertEqual(user.role, "admin")

    def test_get_nonexistent_user(self):
        """Retrieve a nonexistent user"""
        user = get_user("nonexistent")
        self.assertIsNone(user)

    def test_get_all_users_exist(self):
        """Check all predefined users exist in the fake DB"""
        for username in ["admin", "host", "participant"]:
            user = get_user(username)
            self.assertIsNotNone(user)
            self.assertEqual(user.username, username)

    def test_user_object_creation(self):
        """Test User object creation"""
        user = User(
            username="test",
            role="admin",
            email="test@example.com",
            full_name="Test User",
        )
        self.assertEqual(user.username, "test")
        self.assertEqual(user.role, "admin")
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.full_name, "Test User")


class TestAuthentication(unittest.TestCase):
    """Tests for user authentication"""

    def test_authenticate_admin_success(self):
        """Successful authentication for admin"""
        user = authenticate_user("admin", "adminsecure2026")
        self.assertIsNotNone(user)
        self.assertEqual(user.username, "admin")
        self.assertEqual(user.role, "admin")

    def test_authenticate_host_success(self):
        """Successful authentication for host"""
        user = authenticate_user("host", "hostpass456")
        self.assertIsNotNone(user)
        self.assertEqual(user.username, "host")
        self.assertEqual(user.role, "meeting_host")

    def test_authenticate_participant_success(self):
        """Successful authentication for participant"""
        user = authenticate_user("participant", "participant789")
        self.assertIsNotNone(user)
        self.assertEqual(user.username, "participant")

    def test_authenticate_wrong_password(self):
        """Authentication with wrong password"""
        user = authenticate_user("admin", "wrongpassword")
        self.assertIsNone(user)

    def test_authenticate_nonexistent_user(self):
        """Authentication attempt for a nonexistent user"""
        user = authenticate_user("nonexistent", "somepassword")
        self.assertIsNone(user)

    def test_authenticate_empty_credentials(self):
        """Authentication with empty credentials"""
        user = authenticate_user("", "")
        self.assertIsNone(user)


class TestTokenCreation(unittest.TestCase):
    """Tests for JWT token creation"""

    def test_create_access_token_basic(self):
        """Create a basic access token"""
        data = {"sub": "admin"}
        token = create_access_token(data)
        self.assertIsNotNone(token)
        self.assertIsInstance(token, str)

    def test_create_token_with_expiration(self):
        """Create a token with a custom expiration time"""
        data = {"sub": "admin"}
        expires_delta = timedelta(hours=2)
        token = create_access_token(data, expires_delta)
        self.assertIsNotNone(token)

    def test_token_can_be_decoded(self):
        """Verify that the created token can be decoded"""
        data = {"sub": "admin", "role": "admin"}
        token = create_access_token(data)
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        self.assertEqual(decoded["sub"], "admin")
        self.assertEqual(decoded["role"], "admin")

    def test_token_contains_expiration(self):
        """Verify that the token contains an expiration (exp) claim"""
        data = {"sub": "admin"}
        token = create_access_token(data)
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        self.assertIn("exp", decoded)

    def test_token_with_custom_data(self):
        """Create a token with custom payload data"""
        data = {"sub": "user123", "role": "host", "custom": "value"}
        token = create_access_token(data)
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        self.assertEqual(decoded["sub"], "user123")
        self.assertEqual(decoded["role"], "host")
        self.assertEqual(decoded["custom"], "value")


class TestRoleRequirement(unittest.TestCase):
    """Tests for role requirement dependencies"""

    def test_role_requirement_function_exists(self):
        """Check the creation of the role dependency function"""
        role_checker = require_role(["admin"])
        self.assertIsNotNone(role_checker)
        self.assertTrue(callable(role_checker))

    def test_multiple_roles_allowed(self):
        """Check the function with multiple allowed roles"""
        role_checker = require_role(["admin", "host"])
        self.assertIsNotNone(role_checker)

    def test_empty_roles_list(self):
        """Check the function with an empty list of roles"""
        role_checker = require_role([])
        self.assertIsNotNone(role_checker)


class TestFakeDatabase(unittest.TestCase):
    """Tests for the fake user database"""

    def test_fake_db_structure(self):
        """Check the structure of the fake DB"""
        self.assertIn("admin", fake_users_db)
        self.assertIn("host", fake_users_db)
        self.assertIn("participant", fake_users_db)

    def test_admin_user_data(self):
        """Check admin user data fields"""
        admin = fake_users_db["admin"]
        self.assertEqual(admin["username"], "admin")
        self.assertEqual(admin["role"], "admin")
        self.assertIn("email", admin)
        self.assertIn("hashed_password", admin)

    def test_all_users_have_required_fields(self):
        """Verify all users have the required fields"""
        required_fields = ["username", "full_name", "email", "hashed_password", "role"]
        for username, user_data in fake_users_db.items():
            for field in required_fields:
                self.assertIn(field, user_data, f"Field {field} missing for user {username}")


class TestConstants(unittest.TestCase):
    """Tests for module constants"""

    def test_secret_key_exists(self):
        """Check if SECRET_KEY is defined"""
        self.assertIsNotNone(SECRET_KEY)
        self.assertIsInstance(SECRET_KEY, str)
        self.assertGreater(len(SECRET_KEY), 0)

    def test_algorithm_is_hs256(self):
        """Check the JWT algorithm"""
        self.assertEqual(ALGORITHM, "HS256")


if __name__ == "__main__":
    unittest.main()
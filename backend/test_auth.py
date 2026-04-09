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
    """Тесты для проверки пароля"""

    def setUp(self):
        self.plain_password = "testpassword123"
        self.hashed_password = pwd_context.hash(self.plain_password)
        self.wrong_password = "wrongpassword"

    def test_verify_correct_password(self):
        """Проверка корректного пароля"""
        result = verify_password(self.plain_password, self.hashed_password)
        self.assertTrue(result)

    def test_verify_incorrect_password(self):
        """Проверка неправильного пароля"""
        result = verify_password(self.wrong_password, self.hashed_password)
        self.assertFalse(result)

    def test_verify_empty_password(self):
        """Проверка пустого пароля"""
        result = verify_password("", self.hashed_password)
        self.assertFalse(result)


class TestUserOperations(unittest.TestCase):
    """Тесты для операций с пользователями"""

    def test_get_existing_user(self):
        """Получение существующего пользователя"""
        user = get_user("admin")
        self.assertIsNotNone(user)
        self.assertEqual(user.username, "admin")
        self.assertEqual(user.role, "admin")

    def test_get_nonexistent_user(self):
        """Получение несуществующего пользователя"""
        user = get_user("nonexistent")
        self.assertIsNone(user)

    def test_get_all_users_exist(self):
        """Проверка всех пред定义ных пользователей"""
        for username in ["admin", "host", "participant"]:
            user = get_user(username)
            self.assertIsNotNone(user)
            self.assertEqual(user.username, username)

    def test_user_object_creation(self):
        """Тест создания объекта User"""
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
    """Тесты для аутентификации"""

    def test_authenticate_admin_success(self):
        """Успешная аутентификация администратора"""
        user = authenticate_user("admin", "adminsecure2026")
        self.assertIsNotNone(user)
        self.assertEqual(user.username, "admin")
        self.assertEqual(user.role, "admin")

    def test_authenticate_host_success(self):
        """Успешная аутентификация хоста"""
        user = authenticate_user("host", "hostpass456")
        self.assertIsNotNone(user)
        self.assertEqual(user.username, "host")
        self.assertEqual(user.role, "meeting_host")

    def test_authenticate_participant_success(self):
        """Успешная аутентификация участника"""
        user = authenticate_user("participant", "participant789")
        self.assertIsNotNone(user)
        self.assertEqual(user.username, "participant")

    def test_authenticate_wrong_password(self):
        """Аутентификация с неправильным паролем"""
        user = authenticate_user("admin", "wrongpassword")
        self.assertIsNone(user)

    def test_authenticate_nonexistent_user(self):
        """Попытка аутентификации несуществующего пользователя"""
        user = authenticate_user("nonexistent", "somepassword")
        self.assertIsNone(user)

    def test_authenticate_empty_credentials(self):
        """Аутентификация с пустыми учетными данными"""
        user = authenticate_user("", "")
        self.assertIsNone(user)


class TestTokenCreation(unittest.TestCase):
    """Тесты для создания токенов"""

    def test_create_access_token_basic(self):
        """Создание базового токена доступа"""
        data = {"sub": "admin"}
        token = create_access_token(data)
        self.assertIsNotNone(token)
        self.assertIsInstance(token, str)

    def test_create_token_with_expiration(self):
        """Создание токена с пользовательским временем истечения"""
        data = {"sub": "admin"}
        expires_delta = timedelta(hours=2)
        token = create_access_token(data, expires_delta)
        self.assertIsNotNone(token)

    def test_token_can_be_decoded(self):
        """Проверка, что токен может быть декодирован"""
        data = {"sub": "admin", "role": "admin"}
        token = create_access_token(data)
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        self.assertEqual(decoded["sub"], "admin")
        self.assertEqual(decoded["role"], "admin")

    def test_token_contains_expiration(self):
        """Проверка, что токен содержит время истечения"""
        data = {"sub": "admin"}
        token = create_access_token(data)
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        self.assertIn("exp", decoded)

    def test_token_with_custom_data(self):
        """Создание токена с пользовательскими данными"""
        data = {"sub": "user123", "role": "host", "custom": "value"}
        token = create_access_token(data)
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        self.assertEqual(decoded["sub"], "user123")
        self.assertEqual(decoded["role"], "host")
        self.assertEqual(decoded["custom"], "value")


class TestRoleRequirement(unittest.TestCase):
    """Тесты для проверки ролей"""

    def test_role_requirement_function_exists(self):
        """Проверка создания функции проверки роли"""
        role_checker = require_role(["admin"])
        self.assertIsNotNone(role_checker)
        self.assertTrue(callable(role_checker))

    def test_multiple_roles_allowed(self):
        """Проверка функции для нескольких ролей"""
        role_checker = require_role(["admin", "host"])
        self.assertIsNotNone(role_checker)

    def test_empty_roles_list(self):
        """Проверка функции с пустым списком ролей"""
        role_checker = require_role([])
        self.assertIsNotNone(role_checker)


class TestFakeDatabase(unittest.TestCase):
    """Тесты для проверки тестовой базы данных пользователей"""

    def test_fake_db_structure(self):
        """Проверка структуры тестовой БД"""
        self.assertIn("admin", fake_users_db)
        self.assertIn("host", fake_users_db)
        self.assertIn("participant", fake_users_db)

    def test_admin_user_data(self):
        """Проверка данных администратора"""
        admin = fake_users_db["admin"]
        self.assertEqual(admin["username"], "admin")
        self.assertEqual(admin["role"], "admin")
        self.assertIn("email", admin)
        self.assertIn("hashed_password", admin)

    def test_all_users_have_required_fields(self):
        """Проверка, что все пользователи имеют требуемые поля"""
        required_fields = ["username", "full_name", "email", "hashed_password", "role"]
        for username, user_data in fake_users_db.items():
            for field in required_fields:
                self.assertIn(field, user_data, f"Field {field} missing for user {username}")

    def test_users_have_unique_roles(self):
        """Проверка уникальности ролей пользователей"""
        roles = [user["role"] for user in fake_users_db.values()]
        self.assertEqual(len(roles), len(set(roles)))


class TestConstants(unittest.TestCase):
    """Тесты для проверки констант"""

    def test_secret_key_exists(self):
        """Проверка наличия секретного ключа"""
        self.assertIsNotNone(SECRET_KEY)
        self.assertIsInstance(SECRET_KEY, str)
        self.assertGreater(len(SECRET_KEY), 0)

    def test_algorithm_is_hs256(self):
        """Проверка алгоритма"""
        self.assertEqual(ALGORITHM, "HS256")


if __name__ == "__main__":
    unittest.main()

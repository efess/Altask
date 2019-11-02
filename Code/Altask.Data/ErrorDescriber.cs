using Altask.Data.Model;

namespace Altask.Data {
	/// <summary>
	/// Service to enable localization for application facing data errors.
	/// </summary>
	/// <remarks>
	/// These errors are returned to controllers and are generally used as display messages to end users.
	/// </remarks>
	public class ErrorDescriber {
		/// <summary>
		/// Returns the default <see cref="Error"/>.
		/// </summary>
		/// <returns>The default <see cref="Error"/>.</returns>
		public virtual Error DefaultError(string description) {
			return new Error {
				Code = nameof(DefaultError),
				Description = description
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a concurrency failure.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating a concurrency failure.</returns>
		public virtual Error ConcurrencyFailure() {
			return new Error {
				Code = nameof(ConcurrencyFailure),
				Description = EntityResources.ConcurrencyFailure
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating the specified object <paramref name="name"/> is does not exist.
		/// </summary>
		/// <param name="name">The object name that does not exist.</param>
		/// <returns>An <see cref="Error"/> indicating the specified object <paramref name="name"/> is does not exist.</returns>
		public virtual Error DoesNotExist(string name) {
			return new Error {
				Code = nameof(DoesNotExist),
				Description = string.Format(EntityResources.DoesNotExist, name)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating the specified object <paramref name="childName"/> is does not exist for the specified object <paramref name="parentName"/>.
		/// </summary>
		/// <param name="childName">The child object name that does not exist.</param>
		/// <param name="parentName">The parent object which was specified.</param>
		/// <returns>An <see cref="Error"/> indicating the specified object <paramref name="childName"/> is does not exist for the specified object <paramref name="parentName"/>.</returns>
		public virtual Error DoesNotExistFor(string childName, string parentName) {
			return new Error {
				Code = nameof(DoesNotExistFor),
				Description = string.Format(EntityResources.DoesNotExistFor, childName, parentName)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a password mismatch.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating a password mismatch.</returns>
		public virtual Error PasswordMismatch() {
			return new Error {
				Code = nameof(PasswordMismatch),
				Description = EntityResources.PasswordMismatch
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating invalid credentials.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating invalid credentials.</returns>
		public virtual Error InvalidCredentials() {
			return new Error {
				Code = nameof(InvalidCredentials),
				Description = EntityResources.InvalidCredentials
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating invalid credentials.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating invalid credentials.</returns>
		public virtual Error InvalidConfirmCredentials() {
			return new Error {
				Code = nameof(InvalidConfirmCredentials),
				Description = EntityResources.InvalidConfirmCredentials
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating an invalid login attempt.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating an invalid login attempt.</returns>
		public virtual Error InvalidLoginAttempt() {
			return new Error {
				Code = nameof(InvalidLoginAttempt),
				Description = EntityResources.InvalidLoginAttempt
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating an invalid token.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating an invalid token.</returns>
		public virtual Error InvalidToken() {
			return new Error {
				Code = nameof(InvalidToken),
				Description = EntityResources.InvalidToken
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a recovery code was not redeemed.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating a recovery code was not redeemed.</returns>
		public virtual Error RecoveryCodeRedemptionFailed() {
			return new Error {
				Code = nameof(RecoveryCodeRedemptionFailed),
				Description = EntityResources.RecoveryCodeRedemptionFailed
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating an external login is already associated with an account.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating an external login is already associated with an account.</returns>
		public virtual Error LoginAlreadyAssociated() {
			return new Error {
				Code = nameof(LoginAlreadyAssociated),
				Description = EntityResources.LoginAlreadyAssociated
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating the specified user <paramref name="userName"/> is invalid.
		/// </summary>
		/// <param name="userName">The user name that is invalid.</param>
		/// <returns>An <see cref="Error"/> indicating the specified user <paramref name="userName"/> is invalid.</returns>
		public virtual Error InvalidUserName(string userName) {
			return new Error {
				Code = nameof(InvalidUserName),
				Description = string.Format(EntityResources.InvalidUserName, userName)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating the specified <paramref name="email"/> is invalid.
		/// </summary>
		/// <param name="email">The email that is invalid.</param>
		/// <returns>An <see cref="Error"/> indicating the specified <paramref name="email"/> is invalid.</returns>
		public virtual Error InvalidEmail(string email) {
			return new Error {
				Code = nameof(InvalidEmail),
				Description = string.Format(EntityResources.InvalidEmail, email)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating the specified <paramref name="userName"/> already exists.
		/// </summary>
		/// <param name="userName">The user name that already exists.</param>
		/// <returns>An <see cref="Error"/> indicating the specified <paramref name="userName"/> already exists.</returns>
		public virtual Error DuplicateUserName(string userName) {
			return new Error {
				Code = nameof(DuplicateUserName),
				Description = string.Format(EntityResources.DuplicateUserName, userName)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating the specified <paramref name="email"/> is already associated with an account.
		/// </summary>
		/// <param name="email">The email that is already associated with an account.</param>
		/// <returns>An <see cref="Error"/> indicating the specified <paramref name="email"/> is already associated with an account.</returns>
		public virtual Error DuplicateEmail(string email) {
			return new Error {
				Code = nameof(DuplicateEmail),
				Description = string.Format(EntityResources.DuplicateEmail, email)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating the specified <paramref name="role"/> name is invalid.
		/// </summary>
		/// <param name="role">The invalid role.</param>
		/// <returns>An <see cref="Error"/> indicating the specific role <paramref name="role"/> name is invalid.</returns>
		public virtual Error InvalidRoleName(string role) {
			return new Error {
				Code = nameof(InvalidRoleName),
				Description = string.Format(EntityResources.InvalidRoleName, role)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating the specified <paramref name="role"/> name already exists.
		/// </summary>
		/// <param name="role">The duplicate role.</param>
		/// <returns>An <see cref="Error"/> indicating the specific role <paramref name="role"/> name already exists.</returns>
		public virtual Error DuplicateRoleName(string role) {
			return new Error {
				Code = nameof(DuplicateRoleName),
				Description = string.Format(EntityResources.DuplicateRoleName, role)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a user already has a password.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating a user already has a password.</returns>
		public virtual Error UserAlreadyHasPassword() {
			return new Error {
				Code = nameof(UserAlreadyHasPassword),
				Description = EntityResources.UserAlreadyHasPassword
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating user lockout is not enabled.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating user lockout is not enabled.</returns>
		public virtual Error UserLockoutNotEnabled() {
			return new Error {
				Code = nameof(UserLockoutNotEnabled),
				Description = EntityResources.UserLockoutNotEnabled
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a user is already in the specified <paramref name="role"/>.
		/// </summary>
		/// <param name="role">The duplicate role.</param>
		/// <returns>An <see cref="Error"/> indicating a user is already in the specified <paramref name="role"/>.</returns>
		public virtual Error UserAlreadyInRole(string role) {
			return new Error {
				Code = nameof(UserAlreadyInRole),
				Description = string.Format(EntityResources.UserAlreadyInRole, role)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a user is locked out.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating a user is locked out.</returns>
		public virtual Error UserLockedOut() {
			return new Error {
				Code = nameof(UserLockedOut),
				Description = EntityResources.UserLockedOut
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a user is not in the specified <paramref name="role"/>.
		/// </summary>
		/// <param name="role">The duplicate role.</param>
		/// <returns>An <see cref="Error"/> indicating a user is not in the specified <paramref name="role"/>.</returns>
		public virtual Error UserNotInRole(string role) {
			return new Error {
				Code = nameof(UserNotInRole),
				Description = string.Format(EntityResources.UserNotInRole, role)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a password of the specified <paramref name="length"/> does not meet the minimum length requirements.
		/// </summary>
		/// <param name="length">The length that is not long enough.</param>
		/// <returns>An <see cref="Error"/> indicating a password of the specified <paramref name="length"/> does not meet the minimum length requirements.</returns>
		public virtual Error PasswordTooShort(int length) {
			return new Error {
				Code = nameof(PasswordTooShort),
				Description = string.Format(EntityResources.PasswordTooShort, length)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a password does not meet the minimum number <paramref name="uniqueChars"/> of unique chars.
		/// </summary>
		/// <param name="uniqueChars">The number of different chars that must be used.</param>
		/// <returns>An <see cref="Error"/> indicating a password does not meet the minimum number <paramref name="uniqueChars"/> of unique chars.</returns>
		public virtual Error PasswordRequiresUniqueChars(int uniqueChars) {
			return new Error {
				Code = nameof(PasswordRequiresUniqueChars),
				Description = string.Format(EntityResources.PasswordRequiresUniqueChars, uniqueChars)
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a password entered does not contain a non-alphanumeric character, which is required by the password policy.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating a password entered does not contain a non-alphanumeric character.</returns>
		public virtual Error PasswordRequiresNonAlphanumeric() {
			return new Error {
				Code = nameof(PasswordRequiresNonAlphanumeric),
				Description = EntityResources.PasswordRequiresNonAlphanumeric
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a password entered does not contain a numeric character, which is required by the password policy.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating a password entered does not contain a numeric character.</returns>
		public virtual Error PasswordRequiresDigit() {
			return new Error {
				Code = nameof(PasswordRequiresDigit),
				Description = EntityResources.PasswordRequiresDigit
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a password entered does not contain a lower case letter, which is required by the password policy.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating a password entered does not contain a lower case letter.</returns>
		public virtual Error PasswordRequiresLower() {
			return new Error {
				Code = nameof(PasswordRequiresLower),
				Description = EntityResources.PasswordRequiresLower
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating a password entered does not contain an upper case letter, which is required by the password policy.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating a password entered does not contain an upper case letter.</returns>
		public virtual Error PasswordRequiresUpper() {
			return new Error {
				Code = nameof(PasswordRequiresUpper),
				Description = EntityResources.PasswordRequiresUpper
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating verification is required.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating verification is required.</returns>
		public virtual Error VerificationRequired() {
			return new Error {
				Code = nameof(VerificationRequired),
				Description = EntityResources.VerificationRequired
			};
		}

		/// <summary>
		/// Returns an <see cref="Error"/> indicating the user does not exist.
		/// </summary>
		/// <returns>An <see cref="Error"/> indicating the user does not exist.</returns>
		public virtual Error UserDoesNotExist(string username) {
			return new Error {
				Code = nameof(UserDoesNotExist),
				Description = string.Format(EntityResources.UserDoesNotExist, username)
			};
		}
	}
}

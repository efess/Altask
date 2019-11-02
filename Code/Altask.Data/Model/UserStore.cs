using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Utilities;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace Altask.Data.Model {
	public class UserStore : IUserStore<User, int>,
		IUserEmailStore<User, int>,
		IUserLockoutStore<User, int>,
		IUserPasswordStore<User, int>,
		IUserRoleStore<User, int>,
		IUserTwoFactorStore<User, int> {
		private AltaskDbContext _context;
		private bool _disposed;
		public UserStore(AltaskDbContext context) {
			_context = context;
		}

		public async System.Threading.Tasks.Task CreateAsync(User user) {
			ThrowIfDisposed();
			if (user == null) {
				throw new ArgumentNullException("user");
			}

			_context.Users.Add(user);
			await _context.SaveChangesAsync();
		}

		public async System.Threading.Tasks.Task DeleteAsync(User user) {
			ThrowIfDisposed();
			if (user == null) {
				throw new ArgumentNullException("user");
			}

			_context.Users.Remove(user);
			await _context.SaveChangesAsync();
		}

		public void Dispose() {
			Dispose(true);
			GC.SuppressFinalize(this);
		}

		/// <summary>
		/// If disposing, calls dispose on the _context. Always nulls out the _context
		/// </summary>
		/// <param name="disposing"></param>
		protected virtual void Dispose(bool disposing) {
			if (disposing && _context != null) {
				_context.Dispose();
			}

			_disposed = true;
			_context = null;
		}

		public async Task<User> FindByIdAsync(int userId) {
			ThrowIfDisposed();
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId).WithCurrentCulture();

			if (user != null) {
				_context.Entry(user).Collection(e => e.Roles).Load();
			}

			return user;
		}

		public async Task<User> FindByNameAsync(string userName) {
			ThrowIfDisposed();
			var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName).WithCurrentCulture();

			if (user != null) {
				_context.Entry(user).Collection(e => e.Roles).Load();
			}

			return user;
		}

		public async System.Threading.Tasks.Task UpdateAsync(User user) {
			ThrowIfDisposed();
			if (user == null) {
				throw new ArgumentNullException("user");
			}

			_context.Entry(user).State = EntityState.Modified;
			await _context.SaveChangesAsync();
		}

		private void ThrowIfDisposed() {
			if (_disposed) {
				throw new ObjectDisposedException(GetType().Name);
			}
		}

		public System.Threading.Tasks.Task SetPasswordHashAsync(User user, string passwordHash) {
			ThrowIfDisposed();
			if (user == null) {
				throw new ArgumentNullException("user");
			}
			user.PasswordHash = passwordHash;
			return System.Threading.Tasks.Task.FromResult(0);
		}

		public Task<string> GetPasswordHashAsync(User user) {
			ThrowIfDisposed();
			if (user == null) {
				throw new ArgumentNullException("user");
			}
			return System.Threading.Tasks.Task.FromResult(user.PasswordHash);
		}

		public virtual Task<bool> HasPasswordAsync(User user) {
			return System.Threading.Tasks.Task.FromResult(user.PasswordHash != null);
		}

		public System.Threading.Tasks.Task SetEmailAsync(User user, string email) {
			ThrowIfDisposed();
			if (user == null) {
				throw new ArgumentNullException("user");
			}
			user.EmailAddress = email;
			return System.Threading.Tasks.Task.FromResult(0);
		}

		public Task<string> GetEmailAsync(User user) {
			ThrowIfDisposed();
			if (user == null) {
				throw new ArgumentNullException("user");
			}
			return System.Threading.Tasks.Task.FromResult(user.EmailAddress);
		}

		public Task<bool> GetEmailConfirmedAsync(User user) {
			ThrowIfDisposed();
			if (user == null) {
				throw new ArgumentNullException("user");
			}
			return System.Threading.Tasks.Task.FromResult(true);
		}

		public System.Threading.Tasks.Task SetEmailConfirmedAsync(User user, bool confirmed) {
			throw new NotImplementedException();
		}

		public async Task<User> FindByEmailAsync(string email) {
			ThrowIfDisposed();
			var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailAddress == email).WithCurrentCulture();

			if (user != null) {
				_context.Entry(user).Collection(e => e.Roles).Load();
			}

			return user;
		}

		public Task<DateTimeOffset> GetLockoutEndDateAsync(User user) {
			return System.Threading.Tasks.Task.FromResult(DateTimeOffset.MaxValue);
		}

		public System.Threading.Tasks.Task SetLockoutEndDateAsync(User user, DateTimeOffset lockoutEnd) {
			return System.Threading.Tasks.Task.FromResult(0);
		}

		public Task<int> IncrementAccessFailedCountAsync(User user) {
			return System.Threading.Tasks.Task.FromResult(0);
		}

		public System.Threading.Tasks.Task ResetAccessFailedCountAsync(User user) {
			return System.Threading.Tasks.Task.FromResult(0);
		}

		public Task<int> GetAccessFailedCountAsync(User user) {
			return System.Threading.Tasks.Task.FromResult(0);
		}

		public Task<bool> GetLockoutEnabledAsync(User user) {
			return System.Threading.Tasks.Task.FromResult(false);
		}

		public System.Threading.Tasks.Task SetLockoutEnabledAsync(User user, bool enabled) {
			return System.Threading.Tasks.Task.FromResult(0);
		}

		public System.Threading.Tasks.Task SetTwoFactorEnabledAsync(User user, bool enabled) {
			return System.Threading.Tasks.Task.FromResult(0);
		}

		public Task<bool> GetTwoFactorEnabledAsync(User user) {
			return System.Threading.Tasks.Task.FromResult(false);
		}

		public async System.Threading.Tasks.Task AddUserLogAsync(User user, UserLog log) {
			ThrowIfDisposed();

			if (user == null) {
				throw new ArgumentNullException("user");
			}

            _context.UserLogs.Add(new UserLog() {
                Description = log.Description,
                Metadata = log.Metadata,
                Type = log.Type,
                UserId = user.Id
            });
			await _context.SaveChangesAsync();
		}

		public async System.Threading.Tasks.Task AddToRoleAsync(User user, string roleName) {
			ThrowIfDisposed();

			if (user == null) {
				throw new ArgumentNullException("user");
			}

			if (String.IsNullOrWhiteSpace(roleName)) {
				throw new ArgumentException(Model.EntityResources.ValueCannotBeNullOrEmpty, "roleName");
			}

			var role = await _context.Roles.SingleOrDefaultAsync(r => r.Name == roleName).WithCurrentCulture();

			if (role == null) {
				throw new InvalidOperationException(String.Format(CultureInfo.CurrentCulture, Model.EntityResources.RoleNotFound, roleName));
			}

			var userRole = user.Roles.FirstOrDefault(ur => ur.RoleId == role.Id);

			if (userRole == null) {
				user.Roles.Add(new UserRole() {
					Name = role.Name,
					RoleId = role.Id
				});
			}

			await _context.SaveChangesAsync();
		}

		public async System.Threading.Tasks.Task RemoveFromRoleAsync(User user, string roleName) {
			ThrowIfDisposed();

			if (user == null) {
				throw new ArgumentNullException("user");
			}

			if (String.IsNullOrWhiteSpace(roleName)) {
				throw new ArgumentException(Model.EntityResources.ValueCannotBeNullOrEmpty, "roleName");
			}

			var role = await _context.Roles.SingleOrDefaultAsync(r => r.Name == roleName).WithCurrentCulture();

			if (role == null) {
				throw new InvalidOperationException(String.Format(CultureInfo.CurrentCulture, Model.EntityResources.RoleNotFound, roleName));
			}

			var userRole = user.Roles.FirstOrDefault(ur => ur.RoleId == role.Id);
			user.Roles.Remove(userRole);
			await _context.SaveChangesAsync();
		}

		public async Task<IList<string>> GetRolesAsync(User user) {
			return await _context.Entry(user).Collection(u => u.Roles).Query().Select(ur => ur.Name).ToListAsync().WithCurrentCulture();
		}

		public async Task<bool> IsInRoleAsync(User user, string roleName) {
			ThrowIfDisposed();

			if (user == null) {
				throw new ArgumentNullException("user");
			}

			if (String.IsNullOrWhiteSpace(roleName)) {
				throw new ArgumentException(Model.EntityResources.ValueCannotBeNullOrEmpty, "roleName");
			}

			return await _context.Entry(user).Collection(u => u.Roles).Query().AnyAsync(ur => ur.Name == roleName);
		}
	}
}

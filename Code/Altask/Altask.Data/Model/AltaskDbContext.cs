using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity.Validation;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altask.Data.Model {
	public partial class AltaskDbContext : AltaskEntities {
		private ErrorDescriber _errorDescriber = new ErrorDescriber();

		public AltaskDbContext(string user, string connectionString) : base(connectionString) {
			User = user;
		}

		protected override void OnModelCreating(DbModelBuilder modelBuilder) {
			modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
		}

		public string User { get; set; }

		public new EntityResult SaveChanges() {
			var result = 0;

			try {
				SetModifiedDates();
				result = base.SaveChanges();
			} catch (DbUpdateConcurrencyException) {
				return EntityResult.Failed(_errorDescriber.ConcurrencyFailure());
			} catch (Exception ex) {
				return EntityResult.Failed(ex, _errorDescriber.DefaultError(ex.Message));
			}

			return EntityResult.Succeded(result);
		}

		public new async Task<EntityResult> SaveChangesAsync() {
			var result = 0;

			try {
				SetModifiedDates();
				result = await base.SaveChangesAsync();
			} catch (DbUpdateConcurrencyException) {
				return EntityResult.Failed(_errorDescriber.ConcurrencyFailure());
			} catch (Exception ex) {
				return EntityResult.Failed(ex, _errorDescriber.DefaultError(ex.Message));
			}

			return EntityResult.Succeded(result);
		}

		private void SetModifiedDates() {
			DateTime now = DateTime.UtcNow;

			foreach (var item in ChangeTracker.Entries()) {
				if (item.Entity is ISupportsAuthorFields) {
					var authored = item.Entity as ISupportsAuthorFields;

					if (item.State == EntityState.Added) {
						authored.CreatedBy = User;
						authored.CreatedOn = now;
						authored.UpdatedBy = User;
						authored.UpdatedOn = now;
					} else if (item.State == EntityState.Modified) {
						authored.UpdatedBy = User;
						authored.UpdatedOn = now;
					}
				}
			}
		}
	}
}

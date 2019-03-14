using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Altask.Data;
using Altask.Data.Model;

namespace Altask.www.Controllers {
	public partial class FormController {
		/// <summary>
		/// Performs opertaions against the <see cref="Altask.Data.Model.Form"/> after creation.
		/// </summary>
		/// <param name="entity"></param>
		internal override async Task<EntityResult> AfterCreateAsync(Form entity, bool notifyAll = false) {
			ThrowIfDisposed();

			Context.FormLogs.Add(new FormLog() {
				AfterModel = entity.PublishedModel,
				AfterVersion = entity.Version,
				FormId = entity.Id,
				Type = "Created"
			});
			return await Context.SaveChangesAsync();
		}

		/// <summary>
		/// Performs opertaions against the <see cref="Altask.Data.Model.Form"/> after update.
		/// </summary>
		/// <param name="entity"></param>
		internal override async Task<EntityResult> AfterUpdateAsync(Form entity, bool notifyAll = false) {
			ThrowIfDisposed();

			Context.FormLogs.Add(new FormLog() {
				AfterModel = entity.PublishedModel,
				AfterVersion = entity.Version,
				BeforeModel = entity.DraftModel,
				BeforeVersion = entity.Version,
				FormId = entity.Id,
				Type = "Updated"
			});
			return await Context.SaveChangesAsync();
		}

		[HttpPost]
		[JsonNetFilter]
		/// <summary>
		/// Publishes the specified FormModel to the specified <see cref="Altask.Data.Model.Form"/>.
		/// </summary>
		/// <param name="formId"></param>
		/// <param name="formModel"></param>
		/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
		public virtual async Task<ActionResult> Publish(Altask.Data.Dto.Form form) {
			ThrowIfDisposed();

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			var formEntity = await Context.Forms.FindAsync(form.Id);

			if (formEntity == null) {
				return BadRequest(ErrorDescriber.DoesNotExist("Form"));
			}

			var beforeModel = formEntity.PublishedModel;
			var beforeVersion = formEntity.Version;
			formEntity.FromDto(form);
			formEntity.PublishedModel = formEntity.DraftModel;
			formEntity.Version = DateTime.Now.ToString("yyyy.MM.dd.HH.mm.ss");
			formEntity.Logs.Add(new FormLog() {
				AfterModel = formEntity.PublishedModel,
				AfterVersion = formEntity.Version,
				BeforeModel = beforeModel,
				BeforeVersion = beforeVersion,
				Type = "Publish"
			});

			Context.Entry(formEntity).State = EntityState.Modified;
			var result = await Context.SaveChangesAsync();
			Context.Entry(formEntity).Collection(e => e.Logs).Load();

			if (result.Succeeded) {
				return Ok(new { form = formEntity.ToDto() });
			} else {
				return BadRequest(result);
			}
		}
	}
}
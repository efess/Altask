//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
namespace Altask.www.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using System.Xml;
    using Altask.www.Models;
    using Data.Model;
    
    [Authorize]
    public partial class TaskController : BaseController<Altask.Data.Model.Task, Altask.Data.Dto.Task>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public TaskController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public TaskController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.Task"/>.
    	/// </summary>
    	/// <param name="task"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.Task task) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newTask = new Altask.Data.Model.Task().FromDto(task);
    		Context.Tasks.Add(newTask);
    		BeforeCreate(newTask, task);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(newTask).Collection(e => e.Schedules).Load();
    		Context.Entry(newTask).Collection(e => e.Alerts).Load();
    		Context.Entry(newTask).Reference(e => e.Form).Load();
    		Context.Entry(newTask).Reference(e => e.Category).Load();
    		Context.Entry(newTask).Reference(e => e.Type).Load();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newTask);
    			return Ok(new { task = newTask.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.Task"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.Task"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(long id) {
    		ThrowIfDisposed();
    		var task = await Context.Tasks.FindAsync(id);
    		return Ok(new { task = task.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.Task"/> objects matching the specified filter.
    	/// </summary>
    	/// <param name="filter">A <see cref="Altask.www.Models.TaskListOptions"/> object on which to filter.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List(TaskListOptions filter) {
    		ThrowIfDisposed();
    
    		if (filter == null) {
    			filter = new TaskListOptions();
    		}
    
    		var dtoTasks = new List<Altask.Data.Dto.Task>();
    		var task = await Context.Tasks.AsNoTracking().Where(filter.GetPredicate())
    			.Include(e => e.Form)
    			.Include(e => e.Schedules)
    			.Include(e => e.Category)
    			.Include(e => e.Type)
    			.Include(e => e.Alerts)
    			.ToListAsync();
    
    		foreach(var item in task) {
    			dtoTasks.Add(item.ToDto());
    		}
    
    		return Ok(new { tasks = dtoTasks }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.Task"/>.
    	/// </summary>
    	/// <param name="task"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.Task task) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var taskEntity = await Context.Tasks.FindAsync(task.Id);
    
    		if (taskEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("Task"));
    		}
    
    		taskEntity.FromDto(task);
    		Context.Entry(taskEntity).State = EntityState.Modified;
    		BeforeUpdate(taskEntity, task);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(taskEntity).Collection(e => e.Schedules).Load();
    		Context.Entry(taskEntity).Collection(e => e.Alerts).Load();
    		Context.Entry(taskEntity).Reference(e => e.Form).Load();
    		Context.Entry(taskEntity).Reference(e => e.Category).Load();
    		Context.Entry(taskEntity).Reference(e => e.Type).Load();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(taskEntity);
    			return Ok(new { task = taskEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}

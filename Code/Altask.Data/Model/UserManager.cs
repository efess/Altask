using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace Altask.Data.Model {
	public class UserManager : UserManager<User, int> {
		public UserManager(IUserStore<User, int> store) : base(store) {

		}

        public new IMessageService EmailService { get; set; }

        public async System.Threading.Tasks.Task<EntityResult> AddUserLogAsync(User user, UserLog log) {
			await ((UserStore)Store).AddUserLogAsync(user, log);
			return await System.Threading.Tasks.Task.FromResult(EntityResult.Succeded(0));
		}
	}
}

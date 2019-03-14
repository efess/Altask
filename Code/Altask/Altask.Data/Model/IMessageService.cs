using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altask.Data.Model {
    public interface IMessageService {
        Task<EntityResult> SendAsync(IdentityMessage message);
        Task<EntityResult> SendAsync(string from, string to, string subject, string body);
        EntityResult Send(string from, string to, string subject, string body);
    }
}

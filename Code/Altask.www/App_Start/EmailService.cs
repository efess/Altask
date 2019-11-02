using System;
using System.Threading.Tasks;
using Altask.Data;
using Microsoft.AspNet.Identity;
using RestSharp;
using RestSharp.Authenticators;
using Altask.Data.Model;
using System.Net.Mail;
using System.Web;
using System.ComponentModel;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;

namespace Altask.www {
    public class EmailService : IMessageService {
        private ErrorDescriber _errorDescriber = new ErrorDescriber();
        private string _smtpAddress = string.Empty;
        private int _smtpPort = 0;
        private string _userName = string.Empty;
        private string _password = string.Empty;

        private EmailService() {
            ServicePointManager.ServerCertificateValidationCallback += RemoteCertificateValidationCallback;
        }

        private bool RemoteCertificateValidationCallback(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) {
            return true;
        }

        public EmailService(string smtpAddress, int smtpPort, string userName, string password) : this() {
            _smtpAddress = smtpAddress;
            _smtpPort = smtpPort;
            _userName = userName;
            _password = password;
        }

        public async System.Threading.Tasks.Task<EntityResult> SendAsync(IdentityMessage message) {
            throw new NotImplementedException();
        }

        public EntityResult Send(string from, string to, string subject, string body) {
            try {
                var client = new SmtpClient {
                    UseDefaultCredentials = false,
                    Credentials = new System.Net.NetworkCredential(_userName.ToLower(), _password),
                    Host = _smtpAddress,
                    Port = _smtpPort,
                    Timeout = 10000,        
                };

                var message = new MailMessage(from, to, subject, body);
                client.Send(message);
                return EntityResult.Succeded(0);
            }
            catch (Exception e) {
                return EntityResult.Failed(e, _errorDescriber.DefaultError(e.Message));
            }
        }

        public async Task<EntityResult> SendAsync(string from, string to, string subject, string body) {
            try {
                var client = new SmtpClient {
                    UseDefaultCredentials = false,
                    Credentials = new System.Net.NetworkCredential(_userName.ToLower(), _password),
                    Host = _smtpAddress,
                    Port = _smtpPort,
                    Timeout = 10000,
                };

                var message = new MailMessage(from, to, subject, body);
                await client.SendMailAsync(message);
                return EntityResult.Succeded(0);
            }
            catch (Exception e) {
                return EntityResult.Failed(e, _errorDescriber.DefaultError(e.Message + (e.InnerException != null ? ": " + e.InnerException.Message : "")));
            }
        }
    }
}
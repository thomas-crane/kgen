using Lib_K_Relay.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lib_K_Relay;

namespace %NAME%
{
    public class Plugin : IPlugin
    {
        public string GetAuthor()
        {
            return "%AUTHOR%";
        }

        public string[] GetCommands()
        {
            throw new NotImplementedException();
        }

        public string GetDescription()
        {
            throw new NotImplementedException();
        }

        public string GetName()
        {
            return "%NAME%";
        }

        public void Initialize(Proxy proxy)
        {
            throw new NotImplementedException();
        }
    }
}

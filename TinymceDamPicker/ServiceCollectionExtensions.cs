using System;
using System.ComponentModel.Design.Serialization;
using System.Linq;
using EPiServer.Cms.TinyMce.Core;
using EPiServer.Shell;
using EPiServer.Shell.Modules;
using Microsoft.Extensions.DependencyInjection;

namespace TinymceDamPicker
{
    public static class ModuleHelper
    {
        public const string Modulename = "TinymceDamPicker";
        /// <summary>
        /// Readonly propery for geting the module path.
        /// </summary>
        public static string MyModulePath => Paths.ToResource(typeof(ModuleHelper), string.Empty);

        public static string ToClientResource(string virtualPath)
        {
            return Paths.ToClientResource(typeof(ModuleHelper), virtualPath);
        }
        public static string ToResource(string virtualPath)
        {
            return Paths.ToResource(typeof(ModuleHelper), virtualPath);
        }
    }

    public static class ServiceCollectionExtensions
    {
        private const string PluginName = "tinymcedampicker";
        
        public static IServiceCollection AddDamSelectButton(this IServiceCollection services)
        {
            if (services == null)
                throw new ArgumentNullException(nameof(services));

            services.Configure<ProtectedModuleOptions>(pmo =>
            {
                if (!pmo.Items.Any(x => x.Name.Equals(ModuleHelper.Modulename)))
                {
                    pmo.Items.Add(new ModuleDetails { Name = ModuleHelper.Modulename });
                }
            });

            services.Configure<TinyMceConfiguration>((Action<TinyMceConfiguration>)(config =>
                config.Default()
                    .AddExternalPlugin(PluginName, ModuleHelper.ToClientResource("plugin.js"))
                    .AppendToolbar(PluginName)));
            return services;
        }
    }
}

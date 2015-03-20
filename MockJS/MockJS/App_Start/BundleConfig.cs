using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace MockJS
{
    public class BundleConfig
    {
        #region Public Static Methods

        public static void RegisterBundles(BundleCollection bundles)
        {
            RegisterScripts(bundles);
            RegisterStyles(bundles);
        }

        #endregion

        #region Private Static Methods

        private static void RegisterStyles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/VendorJS")
                        .IncludeDirectory("~/Vendor/qunit", "*.js", true));

            bundles.Add(new ScriptBundle("~/MockJS")
                        .IncludeDirectory("~/Scripts", "*.js"));

            bundles.Add(new ScriptBundle("~/TestsJS")
                        .IncludeDirectory("~/Tests", "*.js", true));
        }
        private static void RegisterScripts(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/VendorCSS")
                        .IncludeDirectory("~/Vendor", "*.css", true));
        } 

        #endregion
    }
}
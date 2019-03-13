/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you require will output into a single css file (admin_login.css in this case)
require('../css/admin.css');

require('../src/admin/vendors/mdi/css/materialdesignicons.min.css');
require('../src/admin/vendors/flag-icon-css/css/flag-icon.min.css');
require('../src/admin/vendors/css/vendor.bundle.base.css');
require('../src/admin/css/vertical-layout-light/style.css');


require('popper.js/dist/umd/popper');
window.PerfectScrollbar = require('perfect-scrollbar').default;
require('../src/admin/vendors/js/vendor.bundle.base.js');
require('../src/admin/js/off-canvas.js');
require('../src/admin/js/hoverable-collapse.js');
require('../src/admin/js/template.js');

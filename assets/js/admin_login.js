/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

require('../src/admin/vendors/mdi/css/materialdesignicons.min.css');
require('../src/admin/vendors/flag-icon-css/css/flag-icon.min.css');
require('../src/admin/vendors/css/vendor.bundle.base.css');
require('../src/admin/css/vertical-layout-light/style.css');

require('jquery/dist/jquery');
require('popper.js/dist/umd/popper');
require('../src/admin/vendors/js/vendor.bundle.base.js');
require('../src/admin/js/off-canvas.js');
require('../src/admin/js/hoverable-collapse.js');
require('../src/admin/js/template.js');
require('../src/admin/js/settings.js');
require('../src/admin/js/todolist.js');

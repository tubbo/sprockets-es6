# Sprockets ES6

**Experimental**

A Sprockets transformer that converts ES6 code into vanilla ES5 with
[Babel JS][].

## Installation

Add the following to your Gemfile:

```ruby
gem 'sprockets', '~> 3'
gem 'sprockets-es6'
```

Run `bundle`, and you'll be able to write JavaScript code like this:

```javascript
let square = (x) => x * x

class Animal {
  constructor(name) {
    this.name = name
  }
}
```

If you're not using Rails, you'll need to `require` the Sprockets
transformer in your `config.ru` file:

```ruby
# config.ru
require 'sprockets/es6'
```

### Modules

This gem has a custom ES6 module loader that needs to be required into
your JavaScript code before using [modules][]. It defines a global
`module` and `exports` object that are expected to be defined by Babel
when executing compiled ES6 modules. After compilation, the
module-exported code in your `.es6` files will not be executed as a
result of the JS code being loaded, only when the module is both
imported and initialized.

Say you have a file called **app/assets/javascripts/posts.es6**:

```javascript
export default function(page) {
  page.find('#posts .new').on('ajax:success', function(event) {
    $(event.currentTarget).trigger('dialog.close');
  });
}
```

The above module's code will not actually be executed until you import
the module and execute the default export as such in your JavaScript
manifest:

```javascript
//= require loader
//= require jquery
//= require jquery_ujs
//= require_tree .
//= require_self

$(document).on('ready', function(event) {
  var scope = $(event.currentTarget);
  module.load('posts')(scope);
});
```

While `module.load` is the "bare metal" used to implement the
`import` syntax in your ES6 code, renaming your manifest to `.es6` is
**not recommended**. See below for a few reasons why. It's a lot easier
right now to deal with these few lines of ugly JavaScript in order to
load the rest of your code easily. You might also notice that the above
manifest is using the `require_tree .` directive, which loads all JS
code into the manifest at once. This method of inclusion is usually not
recommended when all of your JS code lives in the global namespace, but
it's preferable when they've been all segmented into ES6 modules.
Requiring your code doesn't actually run it, it merely defines the code
inside an ES6 module for importing later. The `module.load()` method
is the only means by which those modules are actually available and
executable within the code, and since they're only returned as functions
it's up to you to execute them when you want to.

#### Loading all modules

In addition to loading a single module, a convenience method for loading
all modules at once is provided called `module.init`. This method takes
the arguments you wish to pass into every module, and loads them all at
once while passing your arguments into them:

```javascript
$(document).on('ready', module.init);
```

You can also customize how modules are loaded by providing a callback,
which will override the default functionality and replace it with your
own. This is useful if you want to use the above code to load modules
when the DOM is ready, but you want to pass the document object as a
scope so modules can be re-loaded with any DOM scope:

```javascript
module.on('init', function(currentModule, initArguments) {
  var event = initArguments[0],
      scope = $(event.currentTarget);
  currentModule(scope);
});

$(document).on('ready', module.init);
```

This also works for `module.load` and indeed, `module.init` uses
`module.load` under the hood so the 'load' callbacks will be called on
both events:

```javascript
module.on('load', function(currentModule, initArguments) {
  var event = initArguments[0],
      scope = $(event.currentTarget);
  currentModule(scope);
});

$(document).on('ajax:success', function(event) {
  module.load('forms')(event); // calls the 'load' callback
});
$(document).on('ready', module.init); // also calls the 'load' callback
```

#### Naming

The name of each module is calculated by removing the root path
(`app/assets/javascripts`) and the extension (`.es6`) from the filename.
For example, the module living in `app/assets/javascripts/posts.es6` has
the path name of 'posts', but the module living in
`app/assets/javascripts/admin/posts.es6` will be called 'admin/posts'.
Regardless of what the path name to the module is, the `import` syntax
allows you to choose what the identifier variable name will be when it's
used in your ES6 code:

```javascript
import { create, update, destroy } from 'shared/remote';

export default function(page) {
  page.find('#posts .new').on('ajax:success', create);
  page.find('#posts .edit').on('ajax:success', update);
  page.find('#posts .destroy').on('ajax:success', destroy);
}
```

Babel's cache also keeps a copy of this compiled code around so it won't
be copied a bunch of times in your final JS build, keeping everything
clean, tidy, and best-of-all, fast.

## Releases

This plugin is primarily experimental and will never reach a stable 1.0. The
purpose is to test out BabelJS features on Sprockets 3.x and include it by default
in Sprockets 4.x.

## Asset manifests required for precompiling

`.es6` won't work directly with `config.assets.precompile = %w( foo.es6 )` for annoying
compatibility reasons with Sprockets 2.x. Besides, you should look into moving away from
`config.assets.precompile` and using manifests instead. See the
[Sprockets 3.x UPGRADING guide][] for more information.

[modules]: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules
[Sprockets 3.x UPGRADING guide]: https://github.com/rails/sprockets/blob/master/UPGRADING.md#preference-for-asset-manifest-and-links
[Babel JS]: https://babeljs.io

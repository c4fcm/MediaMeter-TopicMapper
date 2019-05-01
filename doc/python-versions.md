Python Version Management (OSX)
==============================

Our dev codebase currently runs with Python v3.6.x on OSX.  However, that is sure to change. Managing Python 
versions can be hard, so this document introduce our approach.
 
PyEnv
-----

We manage different versions with [pyenv](https://github.com/pyenv/pyenv). Install this with HomeBrew:
```
brew update
brew install pyenv
```

Then install the versions of Python we need:
```
pyenv install 3.6.5
```

PyEnv-VirtualEnv
----------------

For managing a virtual enviromnent with a specific version of python for our project, we use 
[pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv). Install this with homebrew as well
```
brew install pyenv-virtualenv
```
As noted in their readme, you'll need to add these two lines to your `.bash_profile` file (or you `.profile` file). Then open a new terminal session:
```
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

And then create a virtualenv for this project.  The name is important, because the `.python-version` file
refers to it so it loads automatically when you enter the directory (if `eval "$(pyenv virtualenv-init -)"` 
is in your `.profile`):
```
pyenv virtualenv 3.6.5 mc-web-tools
```


Pycharm
----------------
should you decide to use Pycharm, make sure to set the Preferences->Python Interpreter by adding/pointing to your venv created above.
<img src="./images/pycharmInterpreter.png" />
Also, set up your configuration like so:
<img src="./images/pycharmConfiguration.png" />

var mongoose = require('mongoose'),
  crypto = require('crypto'),
  oAuthProviders = ['facebook'],
  Schema = mongoose.Schema;

// User Schema
var userSchema = new Schema({
  name: {
    type: String,
    select: true
  },
  email: {
    type: String,
    select: true
  },
  username: {
    type: String
  },
  provider: {
    type: String,
    default: 'local'
  },
  hashed_password: {
    type: String,
    select: false,
    default: ''
  },
  salt: {
    type: String,
    select: false
  }
});

// Virtuals

userSchema.virtual('password')
// Setter for hashing a given password
.set(function(password) {
  this._password = password;
  this.hashed_password = this.encryptPasswordSync(password);
})
// Getter for the plain text password (this is not stored anywhere)
.get(function() {
  return this._password;
});

// Validations

var validatePresenceOf = function(value) {
  return value && value.length;
};

// The below 5 validations only apply if you are signing up with a local provider

userSchema.path('name').validate(function(name) {
  if (!this.validationRequired()) return true;
  return name.length;
}, 'Name cannot be blank');

userSchema.path('email').validate(function(email) {
  if (!this.validationRequired()) return true;
  return email.length;
}, 'Email cannot be blank');

userSchema.path('email').validate(function(email, fn) {
  var User = mongoose.model('User');
  if (!this.validationRequired()) fn(true);

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({
      email: email
    }).exec(function(err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Email already exists');

userSchema.path('username').validate(function(username) {
  if (!this.validationRequired()) return true;
  return username.length;
}, 'Username cannot be blank');

userSchema.path('hashed_password').validate(function(hashed_password) {
  if (!this.validationRequired()) return true;
  return hashed_password.length;
}, 'Password cannot be blank');

// Pre save

userSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && this.validationRequired())
  // There is no virtual field password but the user is using a local account
    next(new Error('Invalid password'));
  else {
    next();
  }
});

// Methods

userSchema.methods = {

  // Match a given plain text to a hashed copy of the real password
  authenticate: function(password, next) {
    var user = this;
    user.encryptPassword(password, function(err, key) {
      if (err)
        next(err, false);
      else if (user.hashed_password === key) {
        next(null, true);
      } else {
        next(null, false);
      }
    });
  },

  // Generate random string to ensure better encryption by adding it to the password
  makeSalt: function() {
    return crypto.randomBytes(64, function(err, buffer) {
      if (err) throw err;
      return buffer.toString('base64');
    });
  },

  // Generate and encrypted string represetation using a given password and the salt of the user
  encryptPassword: function(password, cb) {
    if (!password)
      return cb('Password cannot be empty', null);
    if (!this.salt) {
      // Generate salt
      crypto.randomBytes(64, function(err, buf) {
        if (err) throw err;
        this.salt = buf.toString('base64');
        // Hash password with this salt using 100 iterations and generating a key with 64 characters
        crypto.pbkdf2(password, this.salt, 100, 64, function(err, enc) {
          if (err) throw err;
          cb(null, enc.toString('base64'));
        })
      });
    } else {
      crypto.pbkdf2(password, this.salt, 100, 64, function(err, enc) {
        if (err) throw err;
        cb(null, enc.toString('base64'));
      });
    }
  },


  // Generate and encrypted string represetation using a given password and the salt of the user
  encryptPasswordSync: function(password) {
    if (!password)
      return '';
    if (!this.salt) {
      // Generate salt
      this.salt = crypto.randomBytes(64).toString('base64');
      // Hash password with this salt using 10000 iterations and generating a key with 64 characters
      return crypto.pbkdf2Sync(password, this.salt, 100, 64).toString('base64');
    } else {
      return crypto.pbkdf2Sync(password, this.salt, 100, 64).toString('base64');
    }
  },

  // Determine whether the server should take care of validation
  validationRequired: function() {
    // Validation is required when not using OAuth
    return !~oAuthProviders.indexOf(this.provider);
  }
};

// Statics

userSchema.statics = {
  // Get user by id
  getById: function(userId, cb) {
    this.findById(userId)
      .select('-__v')
      .populate('author', 'name')
      .populate('inherits', 'name')
      .exec(cb);
  },

  // Get all users (maybe should be limited to select only some fields)
  getAll: function(options, cb) {
    var filter = options.filter || {};

    this.find(filter)
      .select('-__v')
      .skip(options.offset)
      .limit(options.limit)
      .exec(cb);
  }
};

mongoose.model('User', userSchema);
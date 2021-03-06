var GitHub, Stream, grw;

GitHub = require('github-releases');

Stream = require('stream').Stream;

module.exports = grw = function(options) {
  var github, stream;
  options = options || {};
  stream = new Stream();
  stream.readable = true;
  stream.writable = true;
  if (!(options.repo || options.version || options.ext || options.prefix)) {
    stream.emit('error', new Error('Miss config.'));
  }
  github = new GitHub({
    repo: options.repo
  });
  github.getReleases({
    tag_name: options.version
  }, function(error, releases) {
    var asset, filename, found, key, value, _i, _len, _ref;
    if (error) {
      return stream.emit('error', new Error("Cannot find " + options.repo + " " + options.version + " from GitHub"));
    }
    filename = options.prefix + '.' + options.ext;
    for (key in options) {
      value = options[key];
      filename = filename.replace("{" + key + "}", value);
    }
    found = false;
    _ref = releases[0].assets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      asset = _ref[_i];
      if (!(asset.name === filename)) {
        continue;
      }
      found = !found;
      github.downloadAsset(asset, function(error, inputStream) {
        if (error) {
          return stream.emit('error', new Error("Cannot download " + options.repo + " " + options.version));
        }
        return inputStream.pipe(stream);
      });
    }
    if (!found) {
      return stream.emit('error', new Error("Cannot find " + filename + " in " + options.repo + " " + options.version + " release"));
    }
  });
  stream.write = function(chunk) {
    return stream.emit('data', chunk);
  };
  stream.end = function(data) {
    if (data) {
      stream.write(data);
    }
    return stream.emit('end');
  };
  return stream;
};

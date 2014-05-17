
GitHub = require 'github-releases'
Stream = require('stream').Stream

module.exports = grw= (options)->

    options = (options or {})

    stream = new Stream()
    stream.readable = true
    stream.writable = true

    # Prefix mus like "{repo}-{version}-beta"
    unless options.repo or options.version or options.ext or options.prefix
        stream.emit 'error', new Error 'Miss config.'

    github = new GitHub { repo: options.repo }

    # Get the special versions release list.
    github.getReleases {tag_name: options.version}, (error, releases) ->
        return stream.emit 'error',
        new Error  "Cannot find #{options.repo} #{options.version} from GitHub" if error

        filename = options.prefix + '.' + options.ext
        filename = filename.replace "{#{key}}", value for key, value of options

        found = false
        for asset in releases[0].assets when asset.name is filename
            found = !found
            github.downloadAsset asset, (error, inputStream) ->
                return stream.emit 'error',
                new Error "Cannot download #{options.repo} #{options.version}" if error
                inputStream.pipe stream

        if not found
            stream.emit 'error',
            new Error "Cannot find #{filename} in #{options.repo} #{options.version } release"

    stream.write = (chunk)->
        stream.emit 'data', chunk

    stream.end = (data)->
        stream.write(data) if data
        stream.emit 'end'

    return stream

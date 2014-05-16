var grw = require('../');

describe('grw', function() {

    it('should be a function.', function() {
        grw.should.be.type('function');
    });

    it('should download a release file', function(done) {
        grw = grw({
            repo: 'kbhomes/google-music-mac',
            version: 'v1.1.3',
            prefix: 'Radiant.Player',
            ext: 'zip'
        });

        grw.pipe(process.stdout);
        grw.on('end', function() {
            done();
        });
    });

});

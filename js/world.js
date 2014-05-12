function World() {
    var _entities = [];
    var _lastUpdateTime = Date.now();
    var _lastUpdateCompleted = true;

    World.prototype.addEntity = function(entity) {
        _entities.push(entity);
    }

    World.prototype.update = function() {
        //TODO:Why is _lastUpdateCompleted needed?
        if (_lastUpdateCompleted) {
            _lastUpdateCompleted = false;
            var currentTime = Date.now();
            var lag = currentTime - _lastUpdateTime;
            _lastUpdateTime = currentTime;
            _entities.forEach(function (entity) {
                entity.update(lag);
            });
            _lastUpdateCompleted = true;
        }
    }

    World.prototype.draw = function() {
        _entities.forEach(function (entity) {
            entity.draw();
        });
    }
}

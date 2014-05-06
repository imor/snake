function World(startTime) {
    var _entities = [];
    var _lastUpdateTime = startTime;

    World.prototype.addEntity = function(entity) {
        _entities.push(entity);
    }

    World.prototype.update = function() {
        var currentTime = Date.now();
        var lag = currentTime - _lastUpdateTime;
        _lastUpdateTime = currentTime;
        _entities.forEach(function (entity) {
            entity.update(lag);
        });
    }

    World.prototype.draw = function() {
        _entities.forEach(function (entity) {
            entity.draw();
        });
    }
}

function World() {
    var _entities = {};
    var _lastUpdateTime = Date.now();

    World.prototype.addEntity = function(name, entity) {
        _entities[name] = entity;
    };

    World.prototype.update = function() {
        var currentTime = Date.now();
        var lag = currentTime - _lastUpdateTime;
        _lastUpdateTime = currentTime;
        Object.keys(_entities).forEach(function (entity) {
            _entities[entity].update(lag);
        });
    };

    World.prototype.draw = function() {
        Object.keys(_entities).forEach(function (entity) {
            _entities[entity].draw();
        });
    };

    World.prototype.destroy = function() {
        Object.keys(_entities).forEach(function (entity) {
            _entities[entity].destroy();
        });
    };
}

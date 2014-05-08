function World() {
    var _entities = [];
    var _lastUpdateTime = Date.now();

    var listener = new window.keypress.Listener();
    //HACK:Assuming that _entities[0] is always snake. What happens when there are more objects in the world
    listener.simple_combo("up", function() {
        _entities[0].setDirection(UP);
    });
    listener.simple_combo("right", function() {
        _entities[0].setDirection(RIGHT);
    });
    listener.simple_combo("down", function() {
        _entities[0].setDirection(DOWN);
    });
    listener.simple_combo("left", function() {
        _entities[0].setDirection(LEFT);
    });

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

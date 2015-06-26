var service = (function() {
    var self = {};
    var graph = Viva.Graph.graph();    
    var graphics = Viva.Graph.View.svgGraphics();                
    var layout = Viva.Graph.Layout.forceDirected(graph);
    var renderer = Viva.Graph.View.renderer(graph, { layout: layout, graphics: graphics });

    var load = function() {
      $.ajax({      
        url: '/data/data.json',
        success: refresh
      });
    };

    var refresh = function(data) {
      _.each(data, function(item) {
        graph.addNode(item.source);
        graph.addLink(item.source, item.destination, item.status);
      });
    };

    var render = function() {
      graphics.link(function(link){
        var isStatusOK = link.data === 'OK';
        var ui = Viva.Graph.svg('path').attr('stroke', isStatusOK ? 'green' : 'red').attr('fill', 'none');
        ui.isStatusOK = isStatusOK;
        return ui;
      }).placeLink(function(linkUI, fromPos, toPos) {      
        var ry = linkUI.isBuy ? 10 : 0;
        var data = 'M' + fromPos.x + ',' + fromPos.y + ' A 10,' + ry + ',-30,0,1,' + toPos.x + ',' + toPos.y;
        linkUI.attr("d", data);
      });
      renderer.run();
    };

    self.generate = function() {
        load();
        render();
    };

    return self;
})();
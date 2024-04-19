import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";


// TODO Construct a NavigationPath object using A*


/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system.
 *
 * - Peter
 */
export default class AstarStrategy extends NavPathStrat {


    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {

        //console.log("A* search algorithm begin");
        let start = this.mesh.graph.snap(from);
        let end = this.mesh.graph.snap(to);


        let openSet = [start]; // openset is collection of nodes that is not visited yet

        let previous = new Array(this.mesh.graph.numVertices).fill(-1);


        let gScore = new Array(this.mesh.graph.numVertices).fill(Infinity);
        gScore[start] = 0;


        let fScore = new Array(this.mesh.graph.numVertices).fill(Infinity);
        fScore[start] = this.heuristic(from, to); // initial heuristic estimation
       
        //A* algorithm loop
        while (openSet.length > 0 ) {
            let current = this.lowestF(openSet, fScore);
            if ( current === end ) {
                return new NavigationPath(this.reconstructPath(previous, current, this.mesh.graph));
            }

            openSet.splice( openSet.indexOf(current), 1 );
            // remove current from openSet
            let neighbors = this.mesh.graph.getEdges(current);

            // this go through all neighbors of current
            while (neighbors !== null && neighbors !== undefined) {
                let neighborIdx = neighbors.y; // y is index implemented in Edgenode class
                let GScore = gScore[current] + neighbors.weight; // Distance from start to neighbor
                if (GScore < gScore[neighborIdx]) { // This path to neighbor is better than any previous one
                    previous[neighborIdx] = current;
                    gScore[neighborIdx] = GScore;
                    fScore[neighborIdx] = gScore[neighborIdx] + this.heuristic(this.mesh.graph.positions[neighborIdx], to);
                    if (!openSet.includes(neighborIdx)) {
                        openSet.push(neighborIdx);
                    }
                }
                neighbors = neighbors.next;
            }
        }
    }


    private lowestF(openSet: number[], fScore: number[]): number {
        let lowest = openSet[0];
        for( let i of openSet ) {
            if (fScore[i] < fScore[lowest]) {
                lowest = i;
            }
        }
        // return the node that has least fScore
        return lowest;
    }
   
    private reconstructPath(cameFrom: number[], current: number, graph: PositionGraph): Stack<Vec2> {
        let tempPath: Vec2[] = [];
        while (current !== -1) {
            tempPath.push(graph.positions[current]);
            current = cameFrom[current];
        }
       
        tempPath.reverse(); //since the stack is "LIFO" structure, we have to reverse the stack to check path progress
        let path = new Stack<Vec2>(tempPath.length);

        while (tempPath.length > 0) {
           path.push(tempPath.pop());
        }
       
        return path;
    }
   
    private heuristic(position1: Vec2, position2: Vec2): number {
        let direct_distace = position1.distanceTo(position2);
        // heuristic based on euclid distance
        return direct_distace;
    }

    
}


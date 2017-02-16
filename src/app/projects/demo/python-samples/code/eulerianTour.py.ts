export class EulerianTourPy {

    code:String = `
"""
eulerianTour.py
finds a eulerian tour of a given graph
"""

def find_eulerian_tour(graph):
    edges = {}
    nodes = []
    result = []
    for tup in graph:
        nodes.append(tup[0])
        nodes.append(tup[1])
    
    for x in set(nodes):
        edges[x] = []
        
    for tup in graph:
        edges[tup[0]].append(tup[1])
        edges[tup[1]].append(tup[0])
    
    start = nodes[0]
    result.append(start)
    while len(nodes) > 0:
        
        # if the selected starting node has no remaining edges, there's no tour
        if len(edges[start]) == 0:
            result = []
            break
            
        # take the last edge associated with the current starting node
        end = edges[start].pop()
        
        # don't forget to remove this edge from the ending node's edge list
        edges[end].remove(start)
        
        # remove both nodes of the current edge from the nodes list
        nodes.remove(start)
        nodes.remove(end)
        
        # add the edge to the tour
        result.append(end)
        
        # make the ending node of the current edge the starting node for the
        # next edge
        start = end
        
    return result

test_graph = [(1,2), (2,3), (3, 4), (4, 1)]
print (find_eulerian_tour(test_graph))
`;
}
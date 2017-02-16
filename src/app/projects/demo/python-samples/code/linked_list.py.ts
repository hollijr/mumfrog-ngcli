export class LinkedListPy {

    code:String = `
"""
linkedlist.py
implements a linked list data structure
then tests implementation
"""

class Element(object):
    def __init__(self, value):
        self.value = value
        self.next = None
        
class LinkedList(object):
    def __init__(self, head=None):
        self.head = head
        
    def append(self, new_element):
        current = self.head
        if self.head:
            while current.next:
                current = current.next
            current.next = new_element
        else:
            self.head = new_element
            
    def get_position(self, position):
        """Get an element from a particular position.
        Assume the first position is "1".
        Return "None" if position is not in the list."""
        value = None
        i = 1
        current = self.head
        while current and i < position:
            i+=1;
            current = current.next
        if i == position:
            value = current
        return value
    
    def insert(self, new_element, position):
        """Insert a new node at the given position.
        Assume the first position is "1".
        Inserting at position 3 means between
        the 2nd and 3rd elements."""
        if position == 1:
            new_element.next = self.head
            self.head = new_element
            
        else:
            previous = self.get_position(position - 1)
            if previous == None:
                pass
                        
            else:
                new_element.next = previous.next  # have new element point to what previous pointed
                previous.next = new_element  #  have previous point to new element
    
    
    def delete(self, value):
        """Delete the first node with a given value."""
        current = self.head
        previous = None
        
        # leave loop when either no more links to check or value has been found
        while current and current.value != value:
            previous = current
            current = current.next
               
        # if current is None, value wasn't found so nothing to delete so make sure
        # current isn't None
        if current:
            
            # if previous is None, current is head of list so just reset the head
            # of the list to the current's next pointer
            if not previous:
                self.head = current.next
            
            # otherwise, just reassign the previous element to point to whatever the
            # current element points
            else:
                previous.next = current.next
            

# Test cases
# Set up some Elements
e1 = Element(1)
e2 = Element(2)
e3 = Element(3)
e4 = Element(4)

# Start setting up a LinkedList
ll = LinkedList(e1)
ll.append(e2)
ll.append(e3)

# Test get_position
# Should print 3
print ll.head.next.next.value
# Should also print 3
print ll.get_position(3).value

# Test insert
ll.insert(e4,3)
# Should print 4 now
print ll.get_position(3).value

# Test delete
ll.delete(1)
# Should print 2 now
print ll.get_position(1).value
# Should print 4 now
print ll.get_position(2).value
# Should print 3 now
print ll.get_position(3).value
`;
}
export class BinarySearchPy {

    code:String = `
"""
binary_search_nonrecurs.py
implements a non-recusive binary search
and tests it
"""

def binary_search(input_array, value):
   start = 0
   end = len(input_array) - 1
    
   while start >= 0 and start <= end:
       mid = (end - start) / 2 + start   # lower middle is selected
       print ('start:', start, 'mid:', mid, 'end:', end)
        
       if value == input_array[mid]:
           return mid
       if value < input_array[mid]:
           end = mid - 1
       else:
           start = mid + 1
   return -1

test_list = [1,3,9,11,15,19,29]
test_val1 = 25
test_val2 = 15
print binary_search(test_list, test_val1)
print test_list
print binary_search(test_list, test_val2)
`;

}
import Collection from "../Interfaces/Collection";

/**
 * A FIFO queue with elements of type T
 */
export default class Queue<T> implements Collection {
    /** The maximum number of elements in the Queue */
    private MAX_ELEMENTS: number;

    /** The internal representation of the queue */
    private q: Array<T>;
    
    /** The head of the queue */
    private head: number;
    
    /** The tail of the queue */
    private tail: number;

    /** The current number of items in the queue */
    private size: number;

    /**
     * Constructs a new queue
     * @param maxElements The maximum size of the stack
     */
    constructor(maxElements: number = 100){
        this.MAX_ELEMENTS = maxElements;
        this.q = new Array(this.MAX_ELEMENTS);
        this.head = 0;
        this.tail = 0;
        this.size = 0;
    }

    /**
     * Adds an item to the back of the queue
     * @param item The item to add to the back of the queue
     * if queue is full, then copy the original and paste to new queue that size of origianl queue * 2
     */
    enqueue(item: T): void {
        if (this.size === this.MAX_ELEMENTS) {
            this.expandQueue();
        }
    
        this.q[this.tail] = item;
        this.tail = (this.tail + 1) % this.q.length; // Update to use the new length
        this.size++;
    }
    
    private expandQueue(): void {
        console.log(" QUEUE EXPANDED");
        let newQueue = new Array<T>(this.MAX_ELEMENTS * 2);
        let current = this.head;
        let index = 0;
    
        while (current !== this.tail) {
            newQueue[index++] = this.q[current];
            current = (current + 1) % this.MAX_ELEMENTS;
        }
    
        this.q = newQueue;
        this.head = 0;
        this.tail = this.size; // new tail is at the end of the old queue
        this.MAX_ELEMENTS *= 2; // update the max elements
    }
    

    /**
     * Retrieves an item from the front of the queue
     * @returns The item at the front of the queue
     */
    dequeue(): T {
        if(this.head === this.tail){
            throw new Error("Queue empty - cannot remove element");
        }


        this.size -= 1;
        let item = this.q[this.head];
        // Now delete the item
        delete this.q[this.head];
        this.head = (this.head + 1) % this.MAX_ELEMENTS;
        
        return item;
    }

    /**
     * Returns the item at the front of the queue, but does not remove it
     * @returns The item at the front of the queue
     */
    peekNext(): T {
        if(this.head === this.tail){
            throw "Queue empty - cannot get element"
        }

        let item = this.q[this.head];
        
        return item;
    }

    /**
     * Returns true if the queue has items in it, false otherwise
     * @returns A boolean representing whether or not this queue has items
     */
    hasItems(): boolean {
        return this.head !== this.tail;
    }

    /**
     * Returns the number of elements in the queue.
     * @returns The size of the queue
     */
    getSize(): number {
        return this.size;
    }

    // @implemented
    clear(): void {
        this.forEach((item, index) => delete this.q[index]);
        this.size = 0;
        this.head = this.tail;
    }

    // @implemented
    forEach(func: (item: T, index?: number) => void): void {
        let i = this.head;
        while(i !== this.tail){
            func(this.q[i], i);
            i = (i + 1) % this.MAX_ELEMENTS;
        }
    }

    /**
     * Converts this queue into a string format
     * @returns A string representing this queue
     */
    toString(): string {
        let retval = "";

        this.forEach( (item, index) => {
            let str = item.toString()
            if(index !== 0){
                str += " -> "
            }
            retval = str + retval;
        });

        return "Top -> " + retval;
    }
}
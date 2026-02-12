const useCombainedRefs = (...refs) => {
    return (node) => {
        refs.forEach((ref) => {
            if(!ref) return;

            if(typeof ref === 'function'){
                ref(node)
            }else{
                ref.current = node;
            }
        })
    }
}

export default useCombainedRefs;
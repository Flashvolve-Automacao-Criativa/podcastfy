import { ref } from 'vue';
import { supabase } from '../../../../providers/supabase';

const useRegisterTrack = () => {
    const handleRequestError = (action, error) => {
        console.error(`useRegisterTrack:${action} Error: `, error);
        throw error;
    };

    const registerTrack = async (track) => {
        try {
            const { error } = await supabase.from('tracks').insert(track).single();
            if (error) handleRequestError('registerTrack', error);
        } catch (error) {
            handleRequestError('registerTrack', error);
        }
    };

    return {
        registerTrack,
    };
};

export default useRegisterTrack;
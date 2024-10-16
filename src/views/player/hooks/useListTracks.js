import { ref } from 'vue';
import  { supabase } from '../../../providers/supabase';


const useListTracks = () => {
    const fetchedTracks = ref([]);

    const handleRequestError = (action, error) => {
        console.error(`useListTracks:${action} Error: `, error);
        throw error;
    }

    const fetchTracks = async () => {
        try {
            const { data: tracks } = await supabase.from('tracks').select('*');
            fetchedTracks.value = tracks;
        } catch (error) {
            handleRequestError('fetchTracks', error);
        }
    }

    const fetchTrackByUid = async (uid) => {
        try {
            const { data: track } = await supabase.from('tracks').select('*').eq('uid', uid);
            return track[0];
        } catch (error) {
            handleRequestError('fetchTrackByUid', error);
        }
    }

    return {
        fetchedTracks,
        fetchTracks,
        fetchTrackByUid,
    };
}

export default useListTracks;
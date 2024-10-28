import { ref } from 'vue';
import  { supabase } from '../../../../providers/supabase';

const useListArtists = () => {
    const fetchedArtists = ref([]);

    const handleRequestError = (action, error) => {
        console.error(`useListArtists:${action} Error: `, error);
        throw error;
    };

    const fetchArtistsByCompanyId = async (companyId) => {
        try {
            const { data: tracks } = await supabase.from('tracks').select('*').eq('company_id', companyId);
            const artists = tracks.map(track => track.artist).flat();
            fetchedArtists.value = [...new Set(artists)];
        } catch (error) {
            handleRequestError('fetchArtistsByCompanyId', error);
        }
    };

    return {
        fetchedArtists,
        fetchArtistsByCompanyId,    
    };
};

export default useListArtists;
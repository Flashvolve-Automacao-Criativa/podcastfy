import { ref } from 'vue';
import  { supabase } from '../../../../providers/supabase';

/**
 * Hook para gerenciar a lista de faixas (tracks) utilizando Supabase.
 * @returns {Object} Retorna os métodos e propriedades para gerenciar e buscar faixas.
*/
const useListTracks = () => {
    /**
     * Array reativo que armazena as faixas buscadas.
     * @type {import('vue').Ref<Array<Object>>}
    */
    const fetchedTracks = ref([]);

    /**
     * Manipula erros nas requisições e lança o erro após logar no console.
     * @param {string} action - Nome da ação que resultou no erro.
     * @param {Error} error - Objeto de erro gerado.
     * @throws {Error} - Lança o erro após logá-lo.
    */
    const handleRequestError = (action, error) => {
        console.error(`useListTracks:${action} Error: `, error);
        throw error;
    }

    /**
     * Busca todas as faixas da tabela 'tracks' no Supabase.
     * Atualiza o estado `fetchedTracks` com o resultado da busca.
     * @async
     * @returns {Promise<void>} Retorna uma Promise resolvida quando as faixas forem buscadas.
    */
    const fetchTracksByCompanyId = async (companyId) => {
        try {
            const { data: tracks, error } = await supabase.from('tracks').select('*').eq('company_id', companyId);
            fetchedTracks.value = orderTracksByTitle(tracks);
        } catch (error) {
            handleRequestError('fetchTracksByCompanyId', error);
        }
    }

    /**
     * Ordena as faixas por título - referente a data de criação (SEMANA/WEEK X - DD/MM/AAAA).
     * @param {Array<Object>} tracks - Array de faixas a serem ordenadas.
     * @returns {Array<Object>} Retorna as faixas ordenadas por título - referente a data de criação (SEMANA/WEEK X - DD/MM/AAAA).
    */
    const orderTracksByTitle = (tracks) => {
        return tracks.sort((a, b) => {
            if (b.title < a.title) return -1;
            if (b.title > a.title) return 1;
            return 0;
        });
    }

    /**
     * Busca uma faixa específica pelo UID na tabela 'tracks' no Supabase.
     * @async
     * @param {string} uid - O UID da faixa a ser buscada.
     * @returns {Promise<Object|null>} Retorna a faixa encontrada ou `null` se nenhuma faixa for encontrada.
    */
    const fetchTrackByUid = async (uid) => {
        try {
            const track = fetchedTracks.value.filter(track => track.uid === uid);
            return track[0];
        } catch (error) {
            handleRequestError('fetchTrackByUid', error);
        }
    }


    return {
        fetchedTracks,
        fetchTracksByCompanyId,
        fetchTrackByUid,
    };
}

export default useListTracks;
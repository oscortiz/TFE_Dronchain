import React, { useEffect, useState } from 'react';

import Spinner from './Spinner';

import Swal from 'sweetalert2';

import { PESTICIDAS } from '../utils/config';

function ListadoDrones(props) {

    const {drones, dronChain, cuenta, dronContratado} = props;

    const [ parcela, setParcela ] = useState({
        parcelaId: 0,
        dronId: 0
    });

    const [ contratosPendientes, setContratosPendientes ] = useState({});
    const [ cargando, setCargando ] = useState(true);
   
    const asignarDron = async (parcelaId, dronId) => {
        let error = false;

        if (parcelaId !== '') {
            try {
                await dronChain.asignarDron(Number(dronId), Number(parcelaId), { from: cuenta });               
            } catch (err) {
                error = true;
                console.error('No se ha podido asignar el Dron')
            }                

            if (!error) {
                obtenerContratosPendientes();
                Swal.fire({
                    icon: 'success',
                    title: `¡Parcela ${parcelaId} fumigada por dron ${dronId}!`,
                    text: 'Gracias por utilizar nuestros servicios',                
                    confirmButtonColor: '#8E8C84'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Proceso detenido!',
                    text: 'La parcela no ha podido ser fumigada',                
                    confirmButtonColor: '#8E8C84'
                });                
            } 
            setParcela('');
        }
    }

    const obtenerContratosPendientes = () => {
        if (drones.length === 0) {
            setContratosPendientes({});
            setCargando(false);
        } else {        
            setCargando(true);
            let contratosPorDron = {};
            drones.forEach(dron => {           
                contratosPorDron[dron.id] = [];            
            });

            dronChain.getPastEvents('DronContratado', {
                fromBlock:0,
                toBlock:'latest'            
            })
            .then(eventos => {
                eventos.forEach(evento => {
                    contratosPorDron[evento.returnValues.dronId].push(evento.returnValues.parcelaId);
                });
                
                dronChain.getPastEvents('ParcelaFumigada', {
                    fromBlock:0,
                    toBlock:'latest'            
                })
                .then(eventos => {
                    eventos.forEach(evento => {
                        let index = contratosPorDron[evento.returnValues.dronId].indexOf(evento.returnValues.parcelaId);
                        if (index !== -1) {
                            contratosPorDron[evento.returnValues.dronId].splice(index, 1);
                        }                        
                    });
                    setContratosPendientes(contratosPorDron);
                    setCargando(false);
                })            
            })
        }
    };   

    useEffect(
        ()=> {        
            obtenerContratosPendientes();      
        }, [ drones, dronContratado ]
    );

    if (drones.length === 0) return null;

    return(
        cargando
        ?
        <Spinner />
        :
        (
        <div className="table-responsive-md">
            <table className="table table-hover table-sm mb-0">
                <thead>
                    <tr className="bg-secondary text-white">
                        <th scope="col">#</th>
                        <th scope="col">Altura Vuelo Mínima</th>
                        <th scope="col">Altura Vuelo Máxima</th>
                        <th scope="col">Pesticidas</th>
                        <th scope="col">Coste</th>
                        <th scope="col">Contratos Pendientes</th>
                    </tr>
                </thead>
                <tbody>
                    {drones.map(dron => 
                        <tr key={dron.id}>
                            <td>{dron.id}</td>
                            <td>{dron.alturaVueloMinima}</td>
                            <td>{dron.alturaVueloMaxima}</td>
                            <td>
                                | {dron.pesticidas.map(pest => PESTICIDAS[pest] + ' | ')}
                            </td>
                            <td>{dron.coste}</td>
                            <td>
                                {
                                    (contratosPendientes[dron.id] === undefined || contratosPendientes[dron.id].length === 0)
                                    ?
                                        <p className="mb-0 text-danger font-weight-bold">No hay parcelas para fumigar</p>
                                    :     
                                        (
                                            <div className="form-row">
                                                <div className="col-auto">
                                                    <select
                                                        id={ dron.id }
                                                        className="form-control form-control-sm"
                                                        value={parcela.dronId === dron.id ? parcela.parcelaId : ''}
                                                        onChange={ e => setParcela({parcelaId: e.target.value, dronId: dron.id}) }
                                                    >
                                                        <option value="">-- Seleccione una parcela --</option>
                                                        {
                                                            contratosPendientes[dron.id].map(parcela =>
                                                                <option
                                                                    key={ parcela }
                                                                    value={ parcela }
                                                                >
                                                                    { `Parcela ${parcela}` }
                                                                </option>
                                                            )
                                                        }
                                                    </select> 
                                                </div>
                                                <div className="col-auto">
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={ () => asignarDron(document.getElementById(dron.id).value, dron.id) }
                                                    >
                                                        Asignar
                                                    </button>                                         
                                                </div>                                                                       
                                            </div>
                                        )
                                }                            
                            </td>
                        </tr>                    
                    )}
                </tbody>
            </table>
        </div>
        )
    )
}

export default ListadoDrones;
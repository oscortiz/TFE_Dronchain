import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import DatosUsuario from './DatosUsuario';
import FormDrones from './FormDrones';
import ListadoDrones from './ListadoDrones';

function PanelPropietario(props) {
    const { dronChain, owner, cuenta, empresas, drones } = props;

    return(
        cuenta === undefined
        ? 
            <Redirect to='/' />
        :        
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-12 col-md-4">
                        <DatosUsuario 
                            dronChain={dronChain}
                            owner={owner}
                            cuenta={cuenta}
                            empresas={empresas}
                        />
                    </div>
                    <div className="col-12 col-md-8">
                        <FormDrones
                            dronChain={dronChain}
                            owner={owner}  
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <ListadoDrones drones={drones} />
                    </div>
                </div> 
            </div> 
    )
}

export default PanelPropietario;
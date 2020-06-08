#!/bin/sh

set -e
NAMESPACE=fature

#echo "Verificando si existe virtualservice/gateway para ginni-frontend"
#GINNI_GTW=$(kubectl -n${NAMESPACE} get virtualservice ginni-frontend -o jsonpath="{.metadata.name}" --ignore-not-found)
#if [[ -z $GINNI_GTW ]]
#then
#	echo "No existe. Generando virtualservice/gateway ..."
#	kubectl apply -f deployment-config/ginni-gtw.yaml --namespace ${feature}
#else
#	echo "Ya existe, nos se hace nada..."
#fi


#echo "Verificando si existe deployment para ginni-frontend"
#GINNI_DEPLOYMENT=$(kubectl -n${NAMESPACE} get deployment ginni-frontend -o jsonpath="{.metadata.name}" --ignore-not-found)
#if [[ -z $GINNI_DEPLOYMENT ]]
#then
#	echo "Si existe. Verificando si hay modificaciones ..."
#	kubectl apply -f deployment-config/ginni-frontend.yaml --namespace feature
#else
#	echo "No existe. Generando service/deployment ..."
#	kubectl create -f deployment-config/ginni-frontend.yaml --namespace feature
#	sleep 8
#fi

echo "Se aplican los cambios al gateway"
kubectl apply -f deployment-config/ginni-gtw.yaml --namespace ${NAMESPACE}

echo "Se aplican los cambios al servicio"
kubectl apply -f deployment-config/ginni-frontend.yaml --namespace ${NAMESPACE}

#!/bin/sh
set -e

#GinniDeployment=$(kubectl get deployment -n feature | grep ginni-frontend | cut -f 1 -d " ")
#GinniGtw=$(kubectl get virtualservice -n feature | grep ginni-frontend | cut -f 1 -d " ")
#echo "Desplegando ginni-frontend ..."
#if [ "$GinniDeployment" = "ginni-frontend" ] && [ "$GinniGtw" = "ginni-frontend" ]
#then
#	echo "Bajamos el contenedor actual"
#	kubectl scale deployment.v1.apps/ginni-frontend --replicas=0 --namespace feature
#	sleep 10
#	echo "Escalamos para que levante el contenedor con la nueva imagen generada"
#	kubectl scale deployment.v1.apps/ginni-frontend --replicas=1 --namespace feature
#	sleep 5
#	echo "Nueva version desplegada satisfactoriamente ..."
#else
#	echo "No existe deployment y/o gateway, verifique sus recursos en el cluster ..."
#fi

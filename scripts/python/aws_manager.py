import boto3
from botocore.exceptions import ClientError

def gestionar_s3():
    # Inicializar el cliente de S3 usando el Rol IAM de la instancia
    s3 = boto3.client('s3', region_name='us-east-1')
    
    print("\n--- 1. Listando Buckets de S3 ---")
    try:
        response = s3.list_buckets()
        print('Buckets existentes:')
        for bucket in response['Buckets']:
            print(f'  - {bucket["Name"]}')
    except ClientError as e:
        print(f"Error al listar: {e}")

    # 2. Intentar crear un bucket para el proyecto (opcional)
    # Nota: Los nombres de buckets deben ser únicos a nivel mundial
    bucket_name = f"lightpress-backup-eduardo-{hash('eduardo') % 10000}"
    print(f"\n--- 2. Creando Bucket de Respaldo: {bucket_name} ---")
    try:
        s3.create_bucket(Bucket=bucket_name)
        print(f"¡Bucket {bucket_name} creado con éxito!")
    except ClientError as e:
        print(f"No se pudo crear el bucket (tal vez ya existe): {e}")

def consultar_tabla_puntos():
    print("\n--- 3. Consultando últimos puntos en DynamoDB ---")
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    tabla = dynamodb.Table('LightpressScores')
    
    try:
        response = tabla.scan(Limit=5)
        items = response.get('Items', [])
        for item in items:
            print(f"Jugador: {item['userID']} | Puntos: {item['score']} | Nivel: {item['level']}")
    except Exception as e:
        print(f"Error al leer DynamoDB: {e}")

if __name__ == "__main__":
    print("Iniciando Script de Automatización LightPress...")
    gestionar_s3()
    consultar_tabla_puntos()

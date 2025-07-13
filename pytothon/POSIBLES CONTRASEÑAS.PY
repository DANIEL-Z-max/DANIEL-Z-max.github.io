from itertools import permutations, product

# Posibles bases de contraseñas que tu amiga recuerda
nombres = ["Michel", "Michell", "Yofreilyn", "Darianny", "Michelsantana", "Milade", "Miladis"]
numeros = ["14", "10", "15", "27", "02"]

# Lista donde se guardarán las combinaciones
combinaciones = set()

# Nombre + número y número + nombre
for nombre in nombres:
    for num in numeros:
        combinaciones.add(nombre + num)
        combinaciones.add(num + nombre)

# Combinaciones entre nombres
for n1, n2 in permutations(nombres, 2):
    combinaciones.add(n1 + n2)
    combinaciones.add(n1.lower() + n2.capitalize())

# Combinaciones de dos nombres + número
for n1, n2, num in product(nombres, nombres, numeros):
    if n1 != n2:
        combinaciones.add(n1 + n2 + num)
        combinaciones.add(num + n1 + n2)

# Mostrar las primeras 20 combinaciones
print("Ejemplos de posibles contraseñas generadas:")
for i, c in enumerate(sorted(combinaciones)):
    if i >= 20:
        break
    print(f"{i+1}. {c}")

# Guardar a archivo si lo deseas
with open("combinaciones_passwords.txt", "w") as f:
    for comb in sorted(combinaciones):
        f.write(comb + "\n")

print(f"\nTotal generado: {len(combinaciones)} combinaciones guardadas en 'combinaciones_passwords.txt'")

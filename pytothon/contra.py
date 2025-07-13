from itertools import product

nombres = ["Michel", "Michell", "Yofreilyn", "Darianny", "Michelsantana", "Milade", "Miladis"]
numeros = ["14", "10", "15", "27", "02"]

# Precomputar variaciones de nombres (minúsculas, mayúsculas, capitalizadas)
name_variations = set()
for name in nombres:
    original = name
    lower = name.lower()
    upper = name.upper()
    
    # Añadir variaciones únicas
    variations = {original, lower, upper}
    
    # Añadir versión capitalizada solo si es diferente
    if name != name.capitalize():
        variations.add(name.capitalize())
    
    name_variations |= variations

# Usar set para combinaciones únicas
combinaciones = set()

# Generar combinaciones eficientemente
def generate_combinations():
    # Nombre + número y número + nombre
    for name, num in product(name_variations, numeros):
        yield name + num
        yield num + name
    
    # Dos nombres + número y número + dos nombres
    for name1, name2, num in product(name_variations, name_variations, numeros):
        yield name1 + name2 + num
        yield num + name1 + name2

# Generar y almacenar combinaciones
combinaciones.update(generate_combinations())

# Mostrar información resumida
total = len(combinaciones)
longitud_min = min(len(p) for p in combinaciones)
longitud_max = max(len(p) for p in combinaciones)
longitud_prom = sum(len(p) for p in combinaciones) // total

print(f"Total de combinaciones generadas: {total}")
print(f"Longitud mínima: {longitud_min}, máxima: {longitud_max}, promedio: {longitud_prom}")
print("\nMuestra de 20 contraseñas (ordenadas alfabéticamente):")
for i, pwd in enumerate(sorted(combinaciones)[:20]):
    print(f"{i+1:>2}. {pwd}")

# Guardar en archivo con formato mejorado
nombre_archivo = "combinaciones_passwords_mejorado.txt"
with open(nombre_archivo, "w", encoding="utf-8") as f:
    f.write(f"Total de combinaciones: {total}\n")
    f.write("--------------------------------\n")
    for i, pwd in enumerate(sorted(combinaciones), 1):
        f.write(f"{i:>5}. {pwd}\n")

print(f"\nCombinaciones guardadas en '{nombre_archivo}'")
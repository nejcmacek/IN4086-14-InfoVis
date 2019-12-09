import bpy

outFile = r"//blender-export.json"


def get_data(obj):
    items = [
        f"[{v.co[0]:.6f},{v.co[1]:.6f},{v.co[2]:.6f}]"
        for v
        in obj.data.vertices
    ]
    result = "[" + ",".join(items) + "]"
    return result


def export(outFile):
    content_first = get_data(bpy.data.objects['first'])
    content_last = get_data(bpy.data.objects['last'])
    content = f'{{"first":{content_first},"last":{content_last}}}'

    path = bpy.path.abspath(outFile)
    file = open(path, "w")
    file.write(content)
    file.close()
    print("Content written to: " + path)

export(outFile)

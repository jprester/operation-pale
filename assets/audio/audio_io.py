import subprocess

RATE = 24000


def ff(*args):
    subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)], check=True)

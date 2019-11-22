import cProfile
import pstats


def calls_profile(func,
                  subcalls=True,
                  builtins=False,
                  sortby='cumulative',
                  n=20):
    """Decorator to profile function calls.

    Print to stdout stats from cProfile.

    :param subcalls: count subcalls. (default: True)
    :param builtins: count builtin functions calls. (default: False)
    :param sortby: sort by specified column. (default: 'cumulative')
    :param n: print only n calls. (default: 20)
    """
    def profiled_func(*args, **kwargs):
        profile = cProfile.Profile(builtins=builtins, subcalls=subcalls)
        try:
            profile.enable()
            result = func(*args, **kwargs)
            profile.disable()
            return result
        finally:
            ps = pstats.Stats(profile).sort_stats(sortby)
            ps.print_stats(n)

    return profiled_func

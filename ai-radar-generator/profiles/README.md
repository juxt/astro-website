# ICC profiles

This directory holds CMYK ICC profiles used by `convert-to-cmyk.sh`. Profiles are not committed to the repository because they are licensed redistributions from the ECI.

## Default profile: PSOcoated_v3 (FOGRA51)

The current European standard for coated offset stock.

1. Download `eci_offset_2009.zip` (or the latest equivalent) from <https://www.eci.org/en/downloads>.
2. Extract `PSOcoated_v3.icc` and copy it here as `profiles/PSOcoated_v3.icc`.

## Other useful profiles

- `PSOuncoated_v3_FOGRA52.icc` for uncoated stock.
- `ISOcoated_v2_eci.icc` for FOGRA39 (older but still widely accepted).

Pass any of these as the second argument to `convert-to-cmyk.sh`.

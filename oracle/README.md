# Test Oracle

This component of the project will handle the generation, execution, and outcome of tests.


## Store

All values maintained throughout a test will be stored as a key value pair.


## Steps

### Request

The Request step executes a request by taking in a URL, parameters, and a list of values to retrieve from the resultant
document.

Parameters are passed in as key value pairs wherein the key is the name of the value in the request, and the value is the
name of the value in the store.

Retrieved values are gathered by searching the document using the given CSS selectors. Any such values will be committed
to the store for later use by other steps. If the multiple option is specified, all values matching the selectors will
be stored in the value as an array item.

### Generate

The Generate step generates values to be committed to the store for use by later steps. The Generate step takes in an
array of value schemas which are used to generate values using the provided generator.

Generators are a set of functions that are available within the library that generate values according to provided
parameters. For example:
- **range**: Generates a number within the range of two values.
- **date**: Converts a date, month, and year value into a UTC date value.
- **str**: Generates a random string of defined characters of a given length.

### Assert

The Assert step will run a list of assertions and provide a success value for each. If an assertion fails, the entire
Assert step fails.

Assert steps are also provided with a value to indicate whether it is a primary assertion step. Primary Assertion steps 
are reserved for the final outcome of a test, as opposed to validating input values.

Assertions are a set of functions that take in values and return a success value. For example:
- **lt**: Asserts that all values are less than the next.
- **lt-eq**: Asserts that all values are less or equal to the next.

In comparisons: if a value is an array, it will be assessed as the minimum/maximum of that array (depending on
its position in the comparison).
  

## Success and Failure

Success is defined as either:
- All Assert steps succeeding, _or_
- All primary Assert steps failing, and at least one other Assert step failing.

If all input values are valid, then the output should be successful. If any of the input values are invalid, then the
output should fail.


## Schema

The Steps of any given test will be defined in a JSON document. An incomplete example follows:

```json
[
  {
    "step": "request",
    "url": "https://www.booking.com/",
    "type": "GET",
    "retrieve": [
      {
        "name": "label",
        "type": "number",
        "selectors": [
          "form#frm > input[name='label']"
        ],
        "parameter": "value",
        "multiple": false
      }
    ]
  },
  {
    "step": "generate",
    "values": [
      {
        "name": "checkin_year",
        "type": "number",
        "generator": {
          "type": "range",
          "lower": 1,
          "upper": 12
        }
      },
      {
        "name": "checkout_year",
        "type": "number",
        "generator": {
          "type": "range",
          "values": {
            "lower": 1,
            "upper": 12
          }
        }
      },
      {
        "name": "checkin",
        "type": "number",
        "generator": {
          "type": "date",
          "values": {
            "year": "checkin_year",
            "month": "checkin_month",
            "day": "checkin_day"
          }
        }
      }
    ]
  },
  {
    "step": "assert",
    "assertions": [
      {
        "type": "lt",
        "values": [
          "checkin",
          "checkout"
        ]
      }
    ]
  },
  {
    "step": "request",
    "url": "https://www.booking.com/",
    "parameters": {
      "checkin_year": "checkin_year",
      "checkout_year": "checkout_year"
    },
    "retrieve": [
      {
        "name": "prices",
        "selectors": [
          "div#hotellist_inner > div table[role='presentation']  .entire_row_clickable.roomrow > .roomPrice.sr_discount .tpi_price_label.tpi_price_label__orange",
          "div > .sr_item_content.sr_item_content_slider_wrapper div[role='presentation']  .entire_row_clickable.roomrow.roomrow_flex > .roomPrice.roomPrice_flex.sr_discount .bui-price-display__value.prco-inline-block-maker-helper"
        ],
        "type": "number",
        "multiple": true
      }
    ]
  },
  {
    "step": "assert",
    "primary": true,
    "assertions": [
      {
        "type": "lt-eq",
        "values": [
          "prices",
          "max_price"
        ]
      }
    ]
  }
]
```